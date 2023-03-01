import {
  BigNumber,
  BigNumberish,
  CallOverrides,
  Contract,
  ContractTransaction,
  Overrides,
} from "ethers"
import { Swap } from "../swap"

export type PromiseOrValue<T> = T | Promise<T>

export interface IERC20 extends Contract {
  name(overrides?: CallOverrides): Promise<string>
  symbol(overrides?: CallOverrides): Promise<string>
  decimals(overrides?: CallOverrides): Promise<number>
  balanceOf(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>
  allowance(
    owner: PromiseOrValue<string>,
    spender: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>
  approve(
    spender: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  transfer(
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  transferFrom(
    sender: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
}

export interface SwapPair extends Contract {
  token0(overrides?: CallOverrides): Promise<string>
  token1(overrides?: CallOverrides): Promise<string>
}

export interface SwapEventOptions {
  address: string
  symbol: string
  type: "buy" | "sell"
  wethValue: number
  tokenValue: number
  usdValue: number
  wethAmount: BigNumber
  tokenAmount: BigNumber
  price: number
  rate: BigNumber
  rateValue: number
  from: string
  to: string
  timestamp: number
  txHash: string
}

export interface TokenOptions {
  swap?: Swap
  decimals?: number
  slippage?: number
  lpUSD?: boolean
  onSwap?: (options: SwapEventOptions) => void
  onBalanceChange?: Function
  onPriceChange?: (price: number, oldPrice: number) => void
}
