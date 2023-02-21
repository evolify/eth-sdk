import { Wallet } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils"
import { pancake, pancake as swap } from "."
import { bscProvider } from "../provider"
import { bscToken } from "../token/contract"

const wallet = new Wallet(process.env.PK_8888, bscProvider)

async function estimateGas() {
  // const token = bscToken("0x000090bfD62143858ce07689D4D756eB27571000")
  const res = await swap.router.estimateGas.swapExactTokensForETH(
    parseUnits("1", 9),
    0,
    [
      // "0x000090bfD62143858ce07689D4D756eB27571000",
      swap.USDT,
      swap.WETH,
    ],
    "0x87B44226dE5B005Cd97AF194441e1ceDd5d78888",
    Date.now() + 1000 * 60 * 5,
    {
      gasLimit: 10000000,
    }
  )
  // console.log(+res)
  console.log(res)
}

async function main() {
  const token = bscToken("0x6fB0ABd94599E709b229DB9f4C477D7375CF84CB")
  const decimals = await token.decimals()
  console.log(await swap.router.WETH())
  const amounts = await swap.router.getAmountsOut(parseUnits("1"), [
    swap.router.WETH(),
    "0x4851ef7166418e40a3e8aac593f6484f2059af80",
  ])
  console.log(formatUnits(amounts[1], decimals))

  swap.router.estimateGas.swap
}

async function test() {
  pancake
    .connect(wallet)
    .start(2000)
    .onPriceChange(t => console.log("price changed:", t))
}

// main()
// estimateGas()
test()
