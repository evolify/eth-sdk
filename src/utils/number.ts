import { BigNumber, utils } from "ethers";

export function parseUnits(value: string | number, decimals: number){
  return utils.parseUnits(value+"", decimals)
}

export function formatUnits(value: BigNumber, decimals: number){
  return utils.formatUnits(value, decimals)
}
