export const ROUTER_ABI = [
  "function WETH() external pure returns (address)",
  "function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut)",
  "function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) public pure  returns (uint amountIn)",
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)",
  "function addLiquidity( address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
  "function addLiquidityETH( address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity)",
  "function removeLiquidity( address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)",
  "function removeLiquidityETH( address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH)",
  "function swapExactTokensForTokens( uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapTokensForExactTokens( uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForTokensSupportingFeeOnTransferTokens( uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens( uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
  "function swapExactTokensForETHSupportingFeeOnTransferTokens( uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
]

export {default as FACTORY_ABI} from "../abi/factory"


export const SwapConfig = {
  pancake: {
    chain: "bsc",
    factory: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
    router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    WETH: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    USDT: "0x55d398326f99059ff775485246999027b3197955",
    rpcNode: "https://bsc-dataseed4.ninicoin.io/",
    scan: "https://bscscan.com",
    gasLimit: 500000,
    gasPrice: 5, // gwei
  },
  arb: {
    chain: "arb",
    factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
    router: "0x1b02da8cb0d097eb8d57a175b88c7d8b47997506",
    WETH: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    USDT: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    usdDecimals: 6,
    rpcNode: "https://arb1.arbitrum.io/rpc",
    scan: "https://arbiscan.io",
    gasLimit: 5000000,
    gasPrice: 0.1, // gwei
  },
  heco: {
    chain: "heco",
    router: "0xed7d5f38c79115ca12fe6c0041abb22f0a06c300",
    // ! change to heco factory address
    factory: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
    WETH: "0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F",
    USDT: "0xa71edc38d189767582c38a3145b5873052c3e47a",
    rpcNode: "https://http-mainnet.hecochain.com",
    scan: "https://arbiscan.io"
  },
}
