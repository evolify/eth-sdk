import { BigNumber, ethers, Wallet } from "ethers"
import { SwapConfig } from "./config"
import { SwapFactory, SwapOptions, SwapRouter } from "./types"
import { parseEther, parseUnits } from "ethers/lib/utils"
import { Factory, Router } from "./contract"
import { Token } from "../token"
import { TokenOptions } from "../token/types"
import { Chain } from "../types"

type SwapConfigType = typeof SwapConfig.pancake & { usdDecimals?: number }

export class Swap {
  factory: SwapFactory
  router: SwapRouter
  WETH: string
  USDT: string
  chain: Chain
  scan: string
  unit = "ETH"
  wallet: Wallet
  config: SwapConfigType
  balance = 0
  rate = BigNumber.from(0)
  price = 0
  timer: any
  usdDecimals = 18
  _onBalanceChange?: Function
  _onPriceChange?: Function
  constructor(config: SwapConfigType) {
    this.config = config
    this.factory = new Factory(
      config.factory,
      new ethers.providers.JsonRpcProvider(config.rpcNode)
    ) as SwapFactory
    this.router = new Router(
      config.router,
      new ethers.providers.JsonRpcProvider(config.rpcNode)
    ) as SwapRouter
    this.USDT = config.USDT
    // May faster than await this.router.WETH()
    this.WETH = config.WETH
    this.chain = config.chain as Chain
    this.scan = config.scan
    this.unit = config.unit
    if (config.usdDecimals) {
      this.usdDecimals = config.usdDecimals
    }
    this.start()
  }

  connect(wallet: Wallet) {
    this.wallet = wallet.connect(this.router.provider)
    this.router = this.router.connect(this.wallet) as SwapRouter
    return this
  }

  async buy(
    token: string,
    value: number | string,
    {
      amountOutMin = BigNumber.from(0),
      lpUSD,
      deadline = Date.now() + 1000 * 60 * 5, //5 minutes
      gasLimit = this.config.gasLimit,
      gasPrice = this.config.gasPrice,
      nonce = null,
    }: SwapOptions = {}
  ) {
    try {
      const tx = await this.router.swapExactETHForTokens(
        amountOutMin,
        this.getPath(token, lpUSD),
        this.wallet.address,
        deadline,
        {
          gasLimit: gasLimit,
          gasPrice: parseUnits(gasPrice + "", "gwei"),
          nonce,
          value: parseEther(value + ""),
        }
      )
      console.log(
        `Start to buy \n` +
          `=================
        tokenIn: ${value} WETH
        tokenOut: ${amountOutMin} ${token}`
      )
      const receipt = await tx.wait()
      const txHash = receipt.logs[1].transactionHash
      console.log("*********    buy success    *********")
      console.log(`View transaction : ${this.scanTx(txHash)}`)
      return txHash
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async sell(
    token: string,
    value: BigNumber,
    {
      amountOutMin = BigNumber.from(0),
      lpUSD,
      deadline = Date.now() + 1000 * 60 * 5, //5 minutes
      gasLimit = this.config.gasLimit,
      gasPrice = this.config.gasPrice,
      nonce = null,
    }: SwapOptions = {}
  ) {
    try {
      // ? swapExactTokensForETH or swapExactTokensForETHSupportingFeeOnTransferTokens
      // const tx = await this.router.swapExactTokensForETH(
      const tx = await this.router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        value,
        amountOutMin,
        this.getPath(token, lpUSD, true),
        this.wallet.address,
        deadline,
        {
          gasLimit: gasLimit,
          gasPrice: parseUnits(gasPrice + "", "gwei"),
          nonce,
        }
      )
      console.log(
        `Start to sell \n` +
          `=================
        tokenIn: ${value} ${token}
        tokenOut: ${amountOutMin} WETH`
      )
      const receipt = await tx.wait()
      const txHash = receipt.logs[1].transactionHash
      console.log("*********    sell success    *********")
      console.log(`View transaction : ${this.scanTx(txHash)}`)
      return txHash
    } catch (err) {
      console.log(err)
      return false
    }
  }

  getPath(token: string, lpUSD: boolean, isSell = false) {
    if (isSell) {
      return Array.from(
        new Set([token, lpUSD && this.USDT, this.WETH].filter(Boolean))
      )
    } else {
      return Array.from(
        new Set([this.WETH, lpUSD && this.USDT, token].filter(Boolean))
      )
    }
  }

  async getRate(path: string[], amount: string | number = 1) {
    const amountIn = parseUnits(amount + "", 18)
    try {
      const amounts = await this.router.getAmountsOut(amountIn, path)
      return amounts[path.length - 1]
    } catch (err) {
      console.error(err)
      return BigNumber.from(0)
    }
  }

  async getBalance() {
    if (this.wallet) {
      const res = await this.wallet.getBalance()
      const val = Number(ethers.utils.formatEther(res))
      if (val !== this.balance) {
        this.balance = val
        if (this._onBalanceChange) {
          this._onBalanceChange(val)
        }
      }
    }
    return this.balance
  }

  async getPrice() {
    const amountIn = ethers.utils.parseEther("1")
    const amounts = await this.router.getAmountsOut(amountIn, [
      this.WETH,
      this.USDT,
    ])
    this.rate = amounts[1]
    const val = Number(ethers.utils.formatUnits(amounts[1], this.usdDecimals))
    if (val !== this.price) {
      this.price = val
      if (this._onPriceChange) {
        this._onPriceChange(val)
      }
    }
    return this.price
  }

  async token(address: string, options: TokenOptions = {}) {
    try {
      const token = new Token(address, {
        ...options,
        swap: this,
      })
      await token.init()
      return token
    } catch {
      return null
    }
  }

  scanTx(txHash: string) {
    return `${this.scan}/tx/${txHash}`
  }

  scanToken(token: string) {
    return `${this.scan}/token/${token}`
  }

  scanAddress(address: string) {
    return `${this.scan}/address/${address}`
  }

  async onPriceChange(cb: Function) {
    this._onPriceChange = cb
    return this
  }

  async onBalanceChange(cb: Function) {
    this._onBalanceChange = cb
    return this
  }

  start(duration = 5000) {
    const run = async () => {
      try {
        this.getBalance()
        this.getPrice()
      } catch {
        console.log("loop error, will try again later")
      }
      this.timer = setTimeout(() => {
        run()
      }, duration)
    }
    run()
    return this
  }
}

export const pancake = new Swap(SwapConfig.pancake)

export const sushiArb = new Swap(SwapConfig.arb)

export const swaps = [pancake, sushiArb]

export function getSwap(chain: Chain) {
  return [pancake, sushiArb].find(t => t.chain === chain)
}
