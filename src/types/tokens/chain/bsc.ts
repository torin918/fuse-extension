export enum BscTokenStandard {
    BEP20 = 'bep20', // https://eips.ethereum.org/EIPS/eip-20
}

export interface BscTokenInfo {
    address: string;
    standards: BscTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:bsc => [address => info]
export type BscTokens = Record<string, BscTokenInfo>;

// <prefix>:balance:bsc:address => [canister_id => balance]
export type BscTokenBalances = Record<string, string>;

export interface BscTokenPrice {
    address: string;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:bsc => [address => price]
export type BscTokenPrices = Record<string, BscTokenPrice>;
