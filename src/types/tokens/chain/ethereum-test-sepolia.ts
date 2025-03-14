export enum EthereumTestSepoliaTokenStandard {
    ERC20 = 'erc20', // https://eips.ethereum.org/EIPS/eip-20
}

export interface EthereumTestSepoliaTokenInfo {
    address: string;
    standards: EthereumTestSepoliaTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:ethereum-test-sepolia => [address => info]
export type EthereumTestSepoliaTokens = Record<string, EthereumTestSepoliaTokenInfo>;

// <prefix>:balance:ethereum-test-sepolia:address => [canister_id => balance]
export type EthereumTestSepoliaTokenBalances = Record<string, string>;

export interface EthereumTestSepoliaTokenPrice {
    address: string;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:ethereum-test-sepolia => [address => price]
export type EthereumTestSepoliaTokenPrices = Record<string, EthereumTestSepoliaTokenPrice>;
