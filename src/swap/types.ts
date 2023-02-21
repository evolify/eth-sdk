import {
  BigNumber,
  BigNumberish,
  CallOverrides,
  Contract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
} from "ethers"

export type PromiseOrValue<T> = T | Promise<T>

export interface SwapRouter extends Contract {
  WETH(overrides?: CallOverrides): Promise<string>
  addLiquidity(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    amountADesired: PromiseOrValue<BigNumberish>,
    amountBDesired: PromiseOrValue<BigNumberish>,
    amountAMin: PromiseOrValue<BigNumberish>,
    amountBMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  addLiquidityETH(
    token: PromiseOrValue<string>,
    amountTokenDesired: PromiseOrValue<BigNumberish>,
    amountTokenMin: PromiseOrValue<BigNumberish>,
    amountETHMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  factory(overrides?: CallOverrides): Promise<string>
  getAmountIn(
    amountOut: PromiseOrValue<BigNumberish>,
    reserveIn: PromiseOrValue<BigNumberish>,
    reserveOut: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>
  getAmountOut(
    amountIn: PromiseOrValue<BigNumberish>,
    reserveIn: PromiseOrValue<BigNumberish>,
    reserveOut: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>
  getAmountsIn(
    amountOut: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>
  getAmountsOut(
    amountIn: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>
  removeLiquidity(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    liquidity: PromiseOrValue<BigNumberish>,
    amountAMin: PromiseOrValue<BigNumberish>,
    amountBMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  removeLiquidityETH(
    token: PromiseOrValue<string>,
    liquidity: PromiseOrValue<BigNumberish>,
    amountTokenMin: PromiseOrValue<BigNumberish>,
    amountETHMin: PromiseOrValue<BigNumberish>,
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapETHForExactTokens(
    amountOut: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapExactETHForTokens(
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapExactETHForTokensSupportingFeeOnTransferTokens(
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapExactTokensForETH(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapExactTokensForETHSupportingFeeOnTransferTokens(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapExactTokensForTokens(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amountIn: PromiseOrValue<BigNumberish>,
    amountOutMin: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapTokensForExactETH(
    amountOut: PromiseOrValue<BigNumberish>,
    amountInMax: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  swapTokensForExactTokens(
    amountOut: PromiseOrValue<BigNumberish>,
    amountInMax: PromiseOrValue<BigNumberish>,
    path: PromiseOrValue<string>[],
    to: PromiseOrValue<string>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
}

export interface SwapOptions {
  amountOutMin?: BigNumber
  lpUSD?: boolean
  deadline?: number
  gasLimit?: number
  gasPrice?: number
  nonce?: number | null
}

export interface SwapFactory extends Contract {
  getPair(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>
  allPairs(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[string]>
  allPairsLength(overrides?: CallOverrides): Promise<[BigNumber]>
  createPair(
    tokenA: PromiseOrValue<string>,
    tokenB: PromiseOrValue<string>,
    overrides?: Overrides & {
      from?: PromiseOrValue<string>
    }
  ): Promise<ContractTransaction>
  feeTo(overrides?: CallOverrides): Promise<[string]>
  feeToSetter(overrides?: CallOverrides): Promise<[string]>
}
