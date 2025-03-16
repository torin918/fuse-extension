export enum PolygonTokenStandard {
    ERC20 = 'erc20', // https://eips.ethereum.org/EIPS/eip-20
    NATIVE = 'native',
}

export interface PolygonTokenInfo {
    address: string;
    standards: PolygonTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:ethereum => [address => info]
export type PolygonTokens = Record<string, PolygonTokenInfo>;

// <prefix>:balance:ethereum:address => [canister_id => balance]
export type PolygonTokenBalances = Record<string, string>;

export interface PolygonTokenPrice {
    address: string;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:ethereum => [address => price]
export type PolygonTokenPrices = Record<string, PolygonTokenPrice>;
