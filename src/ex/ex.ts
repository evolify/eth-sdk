import { ethers } from "ethers"
import { getSwap, swaps } from "../swap"
import { Token } from "../token"
import { Chain } from "../types"
import { IToken } from "./types"

export class EX {
  tokens: Token[] = []
  wallet: ethers.Wallet
  _onTokensChange: Function

  connect(privateKey: string) {
    const wallet = new ethers.Wallet(privateKey)
    this.wallet = wallet
    swaps.forEach(t => t.connect(wallet))
  }

  has(address: string) {
    return this.tokens.some(t => t.address === address)
  }

  getToken(address: string) {
    return this.tokens.find(t => t.address === address)
  }

  async findToken(address: string, chain?: Chain) {
    const swap = getSwap(chain)
    if (swap) {
      return await swap.token(address)
    } else {
      for (const s of swaps) {
        const t = await s.token(address)
        if (t) {
          return t
        }
      }
    }
    return null
  }

  async addToken(
    address: string,
    {
      chain,
      symbol = "",
      lpUSD = false,
    }: { chain?: Chain; symbol?: string; lpUSD?: boolean } = {}
  ) {
    if (this.has(address)) {
      return this.getToken(address)
    }
    const t = await this.findToken(address, chain)
    if (t) {
      t.lpUSD = lpUSD
      if (symbol && !t.symbol) {
        t.symbol === symbol
      }
      this.tokens.push(t)
      this.triggerChange()
    }
    return t
  }

  removeToken(address: string) {
    const t = this.tokens.find(t => t.address === address)
    t.destroy()
    this.tokens = this.tokens.filter(t => t.address !== address)
    this.triggerChange()
  }

  async loadTokens(data: IToken[]) {
    for (const item of data) {
      await this.addToken(item.address, {
        chain: item.chain,
        symbol: item.symbol,
        lpUSD: item.lpUSD,
      })
    }
    return this.tokens
  }

  triggerChange() {
    if (this._onTokensChange) {
      this._onTokensChange(this.tokens)
    }
  }

  onChange(cb: (tokens: Token[]) => any) {
    this._onTokensChange = cb
  }
}
