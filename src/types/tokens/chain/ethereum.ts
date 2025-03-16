export enum EthereumTokenStandard {
    ERC20 = 'erc20', // https://eips.ethereum.org/EIPS/eip-20
    NATIVE = 'native',
}

export interface EthereumTokenInfo {
    address: string;
    standards: EthereumTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:ethereum => [address => info]
export type EthereumTokens = Record<string, EthereumTokenInfo>;

// <prefix>:balance:ethereum:address => [canister_id => balance]
export type EthereumTokenBalances = Record<string, string>;

export interface EthereumTokenPrice {
    address: string;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:ethereum => [address => price]
export type EthereumTokenPrices = Record<string, EthereumTokenPrice>;
