import { Token } from "."
import { pancake } from "../swap"

pancake.start(1000)
pancake.onPriceChange(console.log)
async function main() {
  const t = new Token("0xe009d10d5900bf3d68de7935366017ed9e3ea7fc", {
    swap: pancake,
    lpUSD: false,
  })
  // await t.init()
  console.log("wait pair")
  await t.init()
  console.log("pair done")
  // await t.init()
  // console.log(t.decimals, t.symbol)
  const pair = t.pair
  if (pair) {
    console.log(pair.address)
    console.log(await pair.token0())
    console.log(await pair.token1())
  }
}

main()
