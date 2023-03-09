import { BigNumber, ethers } from "ethers"
import erc20, { Pair } from "./contract"
import { pancake, Swap } from "../swap"
import { IERC20, SwapEventOptions, SwapPair, TokenOptions } from "./types"
import { BASE_TOKEN_AMOUNT_FOR_RATE } from "./config"
import { eq } from "../utils/address"
import { waitFor } from "../utils/task"

export class Token {
  swap: Swap
  pair: SwapPair
  address: string
  lpUSD: boolean
  gasLimit = 500000
  gasPrice = 5
  slippage = 10
  decimals: number
  abi: string[]
  contract: IERC20
  symbol = ""
  allowance = BigNumber.from(0)
  balance = BigNumber.from(0)
  price = 0
  rate = BigNumber.from(0)
  _onBalanceChange?: Function
  _onSwap?: (options: SwapEventOptions) => void
  _onPriceChange?: (price: number, oldPrice: number) => void

  get balanceValue() {
    return this.formatUnits(this.balance)
  }

  get rateValue() {
    return this.formatUnits(this.rate)
  }

  get rateEmpty() {
    return this.rate.eq(0)
  }

  get balanceEmpty() {
    return this.balance.eq(0)
  }

  get allowanceEmpty() {
    return this.allowance.eq(0)
  }

  get buyPath() {
    return this.swap.getPath(this.address, this.lpUSD, false)
  }

  get sellPath() {
    return this.swap.getPath(this.address, this.lpUSD, true)
  }

  constructor(
    address: string,
    {
      swap = pancake,
      decimals = 18,
      slippage = 10,
      lpUSD = false,
      onSwap,
      onBalanceChange,
      onPriceChange,
    }: TokenOptions = {}
  ) {
    this.lpUSD = lpUSD
    this.address = address
    this.decimals = decimals
    this.slippage = slippage
    this.swap = swap
    this.gasPrice = swap.config.gasPrice
    this.gasLimit = swap.config.gasLimit
    this._onSwap = onSwap
    this._onBalanceChange = onBalanceChange
    this._onPriceChange = onPriceChange
    this.contract = erc20(address, swap.router.provider)
  }

  async init() {
    ;[this.decimals, this.symbol, this.allowance] = await Promise.all([
      this.contract.decimals(),
      this.contract.symbol(),
      this.swap.wallet
        ? this.contract.allowance(
            this.swap.wallet.address,
            this.swap.router.address
          )
        : BigNumber.from(0),
    ])
    this.getBalance()
    this.waitForPair()
    return this
  }

  async _getPair() {
    if (!this.pair) {
      const pairAddr = await this.swap.factory.getPair(
        this.lpUSD ? this.swap.USDT : this.swap.WETH,
        this.address
      )
      if (Boolean(+pairAddr)) {
        this.pair = new Pair(pairAddr, this.swap.router.provider) as SwapPair
        this.getPrice()
        const token0 = await this.pair.token0()
        this.pair.on(
          "Swap",
          async (
            from: string,
            in0: BigNumber,
            in1: BigNumber,
            out0: BigNumber,
            out1: BigNumber,
            to: string,
            event
          ) => {
            const { transactionHash: txHash } = event
            let type: "buy" | "sell",
              wethAmount: BigNumber,
              tokenAmount: BigNumber
            if (eq(token0, this.address)) {
              // WETH/XXXX like pair, in0, out0 for token, in1, out1 for weth
              if (in1.gt(0)) {
                // buy
                type = "buy"
                wethAmount = in1
                tokenAmount = out0
              } else {
                // sell
                type = "sell"
                wethAmount = out1
                tokenAmount = in0
              }
            } else {
              // XXXX/WETH like pair, in0, out0 for weth, in1, out1 for token
              if (in0.gt(0)) {
                // buy
                type = "buy"
                wethAmount = in0
                tokenAmount = out1
              } else {
                // sell
                type = "sell"
                wethAmount = out0
                tokenAmount = in1
              }
            }
            this._handleSwap(type, wethAmount, tokenAmount, txHash, from, to)
          }
        )
      }
    }
    return this.pair
  }

  async waitForPair(duration = 2000) {
    await waitFor(this._getPair.bind(this), duration)
    return this.pair
  }

  async buy(value: number | string) {
    const amountIn = ethers.utils.parseEther(value + "")
    let amountOutMin = BigNumber.from(0)
    if (this.slippage > 0) {
      const amountOut = this.rateEmpty
        ? await this.getRate(value)
        : amountIn
            .mul(this.rate)
            .div(ethers.utils.parseEther(BASE_TOKEN_AMOUNT_FOR_RATE + ""))
      amountOutMin = amountOut.mul(100).div(100 + this.slippage)
    }
    const res = await this.swap.buy(this.address, value, {
      amountOutMin,
      lpUSD: this.lpUSD,
      gasLimit: this.gasLimit,
      gasPrice: this.gasPrice,
    })
    return res
  }

  async sell(value: number | string) {
    if (this.balanceEmpty) {
      await this.getBalance()
    }
    let input = value.toString()
    if (value > Number.MAX_SAFE_INTEGER) {
      // 科学计数法转普通数字字符串
      input = Number(input).toLocaleString().replace(/,/g, "")
    }
    let amountIn = ethers.utils.parseUnits(input, this.decimals)
    // 避免精度问题导致卖出数量比持仓大，导致交易失败
    if (amountIn.gt(this.balance)) {
      amountIn = this.balance
    }
    // 未授权则先授权
    if (!(await this.ensureAllowance())) {
      return false
    }
    let amountOutMin = BigNumber.from(0)
    if (this.slippage > 0) {
      let amountOut
      if (this.rateEmpty) {
        const amounts: BigNumber[] = await this.swap.router.getAmountsIn(
          amountIn,
          [this.swap.WETH, this.address]
        )
        amountOut = amounts[0]
      } else {
        amountOut = amountIn
          .mul(ethers.utils.parseEther(BASE_TOKEN_AMOUNT_FOR_RATE + ""))
          .div(this.rate)
      }
      amountOutMin = amountOut.sub(amountOut.mul(this.slippage).div(100))
    }
    const res = await this.swap.sell(this.address, amountIn, {
      amountOutMin,
      lpUSD: this.lpUSD,
      gasLimit: this.gasLimit,
      gasPrice: this.gasPrice,
    })
    return res
  }

  async ensureSigner(){
    if(!this.contract.signer){
      this.contract = this.contract.connect(this.swap.wallet) as IERC20
    }
  }

  async ensureAllowance() {
    if (!this.swap.wallet) {
      return false
    }
    if (!this.allowanceEmpty) {
      return true
    }
    this.allowance = await this.contract.allowance(
      this.swap.wallet.address,
      this.swap.router.address
    )
    if (this.allowanceEmpty) {
      return await this.approve()
    }
  }

  async approve() {
    this.ensureSigner()
    try {
      const tx = await this.contract.approve(
        this.swap.router.address,
        ethers.constants.MaxUint256,
        {
          gasLimit: this.gasLimit,
          gasPrice: ethers.utils.parseUnits(this.gasPrice + "", "gwei"),
        }
      )
      const receipt = await tx.wait()
      console.log("Approve transaction hash: ", receipt.transactionHash)
      this.allowance = ethers.constants.MaxUint256
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  parseUnits(value: string | number, decimals = this.decimals) {
    return ethers.utils.parseUnits(value + "", decimals)
  }

  formatUnits(value: BigNumber, decimals = this.decimals) {
    return ethers.utils.formatUnits(value, decimals)
  }

  /**
   * 获取给定BNB能兑换到的token数量
   * @param bnbAmount BNB数量，默认为1
   * @returns 兑换率，BigNumber类型
   */
  async getRate(bnbAmount: string | number = 1) {
    this.rate = await this.swap.getRate(this.buyPath, bnbAmount)
    return this.rate
  }

  /**
   * 获取给定BNB能兑换的token数量，number类型
   * @param bnbAmount BNB数量，默认为1
   * @returns 给定bnb能兑换的token数量，number类型
   */
  async getAmount(bnbAmount = 1) {
    const _rate = await this.getRate(bnbAmount)
    return Number(this.formatUnits(_rate))
  }

  async getPrice() {
    const amount = await this.getAmount()
    if (amount > 0 && this.swap.price > 0) {
      const val = this.swap.price / amount
      if (val !== this.price) {
        if (this._onPriceChange) {
          this._onPriceChange(val, this.price)
        }
        this.price = val
      }
    } else {
      this.price = 0
    }
    return this.price
  }

  async getBalance() {
    if (!this.swap.wallet) {
      return 0
    }
    const res = await this.contract.balanceOf(this.swap.wallet.address)
    if (!res.eq(this.balance)) {
      this.balance = res
      if (this._onBalanceChange) {
        this._onBalanceChange(this.balance)
      }
    }
  }

  async _handleSwap(
    type: "buy" | "sell",
    wethOrUsdAmount: BigNumber,
    tokenAmount: BigNumber,
    txHash: string,
    from: string,
    to: string
  ) {
    if (!this.swap.price) {
      return
    }
    let wethAmount = wethOrUsdAmount
    if (this.lpUSD) {
      wethAmount = wethOrUsdAmount
        .mul(BigNumber.from(10).pow(this.swap.usdDecimals))
        .div(this.swap.rate)
    }
    const currentRate = tokenAmount
      .mul(BigNumber.from(10).pow(18))
      .div(wethAmount)
    const currentRateValue = +this.formatUnits(currentRate)
    const currentPrice = this.swap.price / +this.formatUnits(currentRate)
    const wethValue = +ethers.utils.formatEther(wethAmount)
    this.rate = currentRate
    if (this.price !== currentPrice) {
      if (this._onPriceChange) {
        this._onPriceChange(currentPrice, this.price)
      }
      this.price = currentPrice
    }
    if (this._onSwap) {
      this._onSwap({
        address: this.address,
        symbol: this.symbol,
        type,
        wethValue,
        tokenValue: Number(this.formatUnits(tokenAmount)),
        usdValue: wethValue * this.swap.price,
        wethAmount,
        tokenAmount,
        price: currentPrice,
        rate: currentRate,
        rateValue: currentRateValue,
        from,
        to,
        timestamp: Date.now(),
        txHash,
      })
    }
  }

  onSwap(cb: (options: SwapEventOptions) => void) {
    this._onSwap = cb
  }

  onBalanceChange(cb: (balance: string) => any) {
    this._onBalanceChange = cb
    return this
  }

  onPriceChange(cb: (price: number, oldPrice: number) => void) {
    this._onPriceChange = cb
    return this
  }

  destroy() {
    this.contract.removeAllListeners()
    if (this.pair) {
      this.pair.removeAllListeners()
    }
  }

  scan(){
    return this.swap.scanToken(this.address)
  }
}
