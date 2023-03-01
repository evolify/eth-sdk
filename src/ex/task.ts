import { EX } from "./ex"
import { Token } from "../token"
import { Chain } from "../types"
import { Notify, Order, SwapType, Task, TaskStatus } from "./types"

function newTask(item: Partial<Task>) {
  return {
    id: Date.now() + "",
    chain: Chain.BSC,
    lpUSD: false,
    createTime: Date.now(),
    status: TaskStatus.pendding,
    ...item,
  }
}

class BaseTask <T extends Task> {
  ex: EX
  tasks: T[] = []

  _onChange: (tasks: T[]) => void

  constructor(ex: EX) {
    this.ex = ex
  }

  has(id: string) {
    return this.tasks.some(t => t.id === id)
  }

  async load(data: T[]) {
    for (const item of data) {
      await this.add(item)
    }
  }

  async add(data: Partial<T>) {
    // only add token for new task or pending task
    if (!Boolean(data.id) || data.status === TaskStatus.pendding) {
      const token = await this.ex.addToken(data.token, {
        chain: data.chain,
        symbol: data.symbol,
        lpUSD: data.lpUSD,
      })
      await token.waitForPair()
      token.onSwap(({ price }) => {
        console.log("on swap")
        this.runTask(token, price)
      })
    }
    if (this.has(data.id)) {
      return this.update(data)
    } else {
      const t = newTask(data) as T
      this.tasks.push(t)
      this.triggerChange()
      return t
    }
  }

  update(data: Partial<T>) {
    const idx = this.tasks.findIndex(t => t.id === data.id)
    const t = {
      ...this.tasks[idx],
      ...data,
      updateTime: Date.now(),
    }
    this.tasks[idx] = t
    this.triggerChange()
    return t
  }

  updateStatus(id: string, status: TaskStatus) {
    this.update({
      id,
      status,
    } as Partial<T>)
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.triggerChange()
  }

  filterTasks(token: Token, price: number) {
    if (price === 0) {
      return []
    }
    return this.tasks.filter(
      t => t.token === token.address && t.status === TaskStatus.pendding
    )
  }

  runTask(token: Token, price: number) {
    const tasks = this.filterTasks(token, price)
    // run task
  }

  triggerChange() {
    if (this._onChange) {
      this._onChange(this.tasks)
    }
  }

  onChange(cb: (tasks: T[]) => any) {
    this._onChange = cb
  }
}

export class OrderTask extends BaseTask<Order> {
  runTask(token: Token, price: number) {
    const tasks = super.filterTasks(token, price)
    tasks.forEach(async t => {
      token.slippage = t.slippage
      token.gasLimit = t.gasLimit
      token.gasPrice = t.gasPrice
      const isBuy = t.action === SwapType.buy
      if ((isBuy && price <= t.price) || (!isBuy && price >= t.price)) {
        const action = (isBuy ? token.buy : token.sell).bind(token)
        this.updateStatus(t.id, TaskStatus.running)
        try {
          const res = await action(t.amount)
          console.log("task complete", t.token, t.action)
          this.updateStatus(t.id, res ? TaskStatus.done : TaskStatus.failed)
        } catch (err) {
          console.error(err)
          this.updateStatus(t.id, TaskStatus.failed)
        }
      }
    })
  }
}

export class NotifyTask extends BaseTask<Notify> {
  runTask(token: Token, price: number): void {
    const tasks = super.filterTasks(token, price)
    tasks.forEach(async t => {
      console.log("ex alert:", token.symbol, price)
    })
  }
}
