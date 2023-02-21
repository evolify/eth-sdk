import { Contract, Signer } from "ethers"
import { Provider } from "@ethersproject/abstract-provider"
import { ABI, PAIR_ABI } from "./config"
import { IERC20 } from "./types"
import { bscProvider } from "../provider"

export class ERC20 extends Contract {
  constructor(addressOrName: string, signerOrProvider?: Signer | Provider) {
    super(addressOrName, ABI, signerOrProvider)
  }
  // Contract.connect just create a new Instance, and has some params error, override.
  connect(signerOrProvider: Signer | Provider) {
    return new ERC20(this.address, signerOrProvider)
  }
}

export class Pair extends Contract {
  constructor(addressOrName: string, signerOrProvider?: Signer | Provider) {
    super(addressOrName, PAIR_ABI, signerOrProvider)
  }
  // Contract.connect just create a new Instance, and has some params error, override.
  connect(signerOrProvider: Signer | Provider) {
    return new Pair(this.address, signerOrProvider)
  }
}

export default function erc20(
  addressOrName: string,
  signerOrProvider?: Signer | Provider
) {
  return new ERC20(addressOrName, signerOrProvider) as IERC20
}

export function bscToken(
  addressOrName: string,
  signerOrProvider: Signer | Provider = bscProvider
) {
  return erc20(addressOrName, signerOrProvider)
}

export function arbToken(
  addressOrName: string,
  signerOrProvider: Signer | Provider = bscProvider
) {
  return erc20(addressOrName, signerOrProvider)
}
