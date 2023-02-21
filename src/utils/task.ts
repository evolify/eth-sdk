export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const delay = sleep

export async function check(condition: boolean | Function) {
  if (typeof condition === "function") {
    return await condition()
  }
  return condition
}

export async function waitFor(condition: boolean | Function, delay = 1000) {
  while (!(await check(condition))) {
    await sleep(delay)
    await waitFor(condition, delay)
  }
  return
}

export async function doUntil(
  func: Function,
  condition: boolean | Function,
  delay = 1000
) {
  while (!check(condition)) {
    await func()
    await sleep(delay)
  }
}
