export const ABI = [
  "function decimals() public view returns (uint8)",
  "function balanceOf(address account) external view returns (uint256)",
  "function name() public view returns (string memory)",
  "function symbol() public view returns (string memory)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint value) external returns (bool)",
  "function transferFrom(address from, address to, uint value) external returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]

export {default as PAIR_ABI} from "../abi/pair"

export const BASE_TOKEN_AMOUNT_FOR_RATE = 1
