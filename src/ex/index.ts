import { EX } from "./ex"
import { OrderTask, NotifyTask } from "./task"

export const ex = new EX()
export const orderTask = new OrderTask(ex)
export const notifyTask = new NotifyTask(ex)
