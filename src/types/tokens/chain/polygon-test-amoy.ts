export enum PolygonTestAmoyTokenStandard {
    ERC20 = 'erc20', // https://eips.ethereum.org/EIPS/eip-20
    NATIVE = 'native',
}

export interface PolygonTestAmoyTokenInfo {
    address: string;
    standards: PolygonTestAmoyTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:polygon-test-amoy => [address => info]
export type PolygonTestAmoyTokens = Record<string, PolygonTestAmoyTokenInfo>;

// <prefix>:balance:polygon-test-amoy:address => [canister_id => balance]
export type PolygonTestAmoyTokenBalances = Record<string, string>;

export interface PolygonTestAmoyTokenPrice {
    address: string;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:polygon-test-amoy => [address => price]
export type PolygonTestAmoyTokenPrices = Record<string, PolygonTestAmoyTokenPrice>;
