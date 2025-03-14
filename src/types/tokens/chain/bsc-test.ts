export enum BscTestTokenStandard {
    BEP20 = 'bep20', // https://eips.ethereum.org/EIPS/eip-20
}

export interface BscTestTokenInfo {
    address: string;
    standards: BscTestTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:bsc-test => [address => info]
export type BscTestTokens = Record<string, BscTestTokenInfo>;

// <prefix>:balance:bsc-test:address => [canister_id => balance]
export type BscTestTokenBalances = Record<string, string>;

export interface BscTestTokenPrice {
    address: string;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:bsc-test => [address => price]
export type BscTestTokenPrices = Record<string, BscTestTokenPrice>;
