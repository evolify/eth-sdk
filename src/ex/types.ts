import { Chain } from "../types"
import { SwapEventOptions } from "../token/types"

export interface IToken {
  address: string
  symbol: string
  chain: Chain
  lpUSD?: boolean
}

export enum SwapType {
  buy = "buy",
  sell = "sell",
}

export enum TaskStatus {
  pendding = "pendding",
  running = "running",
  done = "done",
  failed = "failed",
  canceled = "canceled",
}

export interface Task {
  id: string
  symbol: string
  token: string
  chain: Chain
  lpUSD?: boolean
  price: number
  status?: TaskStatus
  createTime?: number
  updateTime?: number
}

export interface Notify extends Task {
  gt: boolean
}

export interface Order extends Task {
  action: SwapType
  amount?: number
  gasPrice?: number
  gasLimit?: number
  slippage?: number
}

export type Tx = SwapEventOptions
