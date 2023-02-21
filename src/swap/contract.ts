import { Provider } from "@ethersproject/abstract-provider";
import { Contract, Signer } from "ethers";
import { FACTORY_ABI, ROUTER_ABI } from "./config";

export class Router extends Contract {
  constructor(addressOrName: string, signerOrProvider?: Signer | Provider) {
    super(addressOrName, ROUTER_ABI, signerOrProvider)
  }
  // Contract.connect just create a new Instance, and has some params error, override.
  connect(signerOrProvider: Signer | Provider) {
    return new Router(this.address, signerOrProvider)
  }
}

export class Factory extends Contract {
  constructor(addressOrName: string, signerOrProvider?: Signer | Provider) {
    super(addressOrName, FACTORY_ABI, signerOrProvider)
  }
  // Contract.connect just create a new Instance, and has some params error, override.
  connect(signerOrProvider: Signer | Provider) {
    return new Factory(this.address, signerOrProvider)
  }
}
