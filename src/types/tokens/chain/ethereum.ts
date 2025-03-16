import type { Address } from 'viem';

export enum EthereumTokenStandard {
    ERC20 = 'erc20', // https://eips.ethereum.org/EIPS/eip-20
    NATIVE = 'native',
}

export interface EthereumTokenInfo {
    address: Address;
    standards: EthereumTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
}

// <prefix>:token:info:ethereum => [address => info]
export type EthereumTokens = Record<Address, EthereumTokenInfo>;

// <prefix>:balance:ethereum:address => [canister_id => balance]
export type EthereumTokenBalances = Record<Address, string>;

export interface EthereumTokenPrice {
    address: Address;
    price?: string;
    price_change_24h?: string;
}

// <prefix>:token:price:ethereum => [address => price]
export type EthereumTokenPrices = Record<Address, EthereumTokenPrice>;
