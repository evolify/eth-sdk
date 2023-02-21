import { ethers } from "ethers"

export const BSC_RPC_NODE = "https://bsc-dataseed4.ninicoin.io/"

export const HECO_RPC_NODE = "https://http-mainnet.hecochain.com"

export const bscProvider = new ethers.providers.JsonRpcProvider(BSC_RPC_NODE)

export const hecoProvider = new ethers.providers.JsonRpcProvider(HECO_RPC_NODE)
