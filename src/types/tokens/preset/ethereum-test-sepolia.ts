
import { TokenTag, type TokenInfo } from '..';
import { EthereumTokenStandard, type EthereumTokenInfo } from './../chain/ethereum';

export const TOKEN_INFO_SEPOLIA_ETH: EthereumTokenInfo     = { address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', name: 'Sepolia Ether',   symbol: 'ETH',   decimals: 18, standards: [EthereumTokenStandard.NATIVE] };
export const TOKEN_INFO_SEPOLIA_WETH: EthereumTokenInfo    = { address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', name: 'Wrapped Ether',   symbol: 'WETH',  decimals: 18, standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_USDC: EthereumTokenInfo    = { address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', name: 'USD Coin',        symbol: 'USDC',  decimals: 6,  standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_USDT: EthereumTokenInfo    = { address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0', name: 'Tether USD',      symbol: 'USDT',  decimals: 6,  standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_DAI: EthereumTokenInfo     = { address: '0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6', name: 'Dai Stablecoin',  symbol: 'DAI',   decimals: 18, standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_LINK: EthereumTokenInfo    = { address: '0x779877A7B0D9E8603169DdbD7836e478b4624789', name: 'ChainLink Token', symbol: 'LINK',  decimals: 18, standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_WBTC: EthereumTokenInfo    = { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', name: 'Wrapped BTC',     symbol: 'WBTC',  decimals: 8,  standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_UNI: EthereumTokenInfo     = { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', name: 'Uniswap',         symbol: 'UNI',   decimals: 18, standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_TEST1: EthereumTokenInfo   = { address: '0x6Bd780E7fDf01D77e4d475c821f1e7AE05409072', name: 'Test Token 1',    symbol: 'TEST1', decimals: 18, standards: [EthereumTokenStandard.ERC20] };
export const TOKEN_INFO_SEPOLIA_TEST2: EthereumTokenInfo   = { address: '0x8267cF9254734C6Eb452a7bb9AAF97B392258b21', name: 'Test Token 2',    symbol: 'TEST2', decimals: 18, standards: [EthereumTokenStandard.ERC20] };

// =========================== all token info ===========================

export const PRESET_ALL_TOKEN_INFO_SEPOLIA: TokenInfo[] = [
    { info: { ethereum: TOKEN_INFO_SEPOLIA_ETH },    tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_WETH },   tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_USDC },   tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_USDT },   tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_DAI },    tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_LINK },   tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_WBTC },   tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_UNI },    tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_TEST1 },  tags: [TokenTag.ChainEthereumTestSepolia] },
    { info: { ethereum: TOKEN_INFO_SEPOLIA_TEST2 },  tags: [TokenTag.ChainEthereumTestSepolia] },
];
