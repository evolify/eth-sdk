import { ex, notifyTask } from ".";
import { Chain } from "../types";

async function main(){
  notifyTask.add({
    chain: Chain.ARB,
    gt: true,
    price: 1.5,
    symbol: "",
    lpUSD: false,
    token: "0xc00180263085e06c3e4a5ffc4a30e52f17b5c545"
  })
}

// main()
ex.addToken("0x0C4681e6C0235179ec3D4F4fc4DF3d14FDD96017")
