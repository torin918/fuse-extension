import type { BscTokenInfo } from './chain/bsc';
import type { BscTestTokenInfo } from './chain/bsc-test';
import type { EthereumTokenInfo } from './chain/ethereum';
import type { EthereumTestSepoliaTokenInfo } from './chain/ethereum-test-sepolia';
import type { IcTokenInfo } from './chain/ic';
import type { PolygonTokenInfo } from './chain/polygon';
import type { PolygonTestAmoyTokenInfo } from './chain/polygon-test-amoy';

export enum TokenTag {
    // ic
    ChainIc = 'chain-ic',
    ChainIcSns = 'chain-ic-sns',
    ChainIcCk = 'chain-ic-ck',
    ChainIcCustom = 'chain-ic-custom',
    // ethereum
    ChainEthereum = 'chain-ethereum',
    ChainEthereumCustom = 'chain-ethereum-custom',
    // ethereum test sepolia
    ChainEthereumTestSepolia = 'chain-ethereum-test-sepolia',
    ChainEthereumTestSepoliaCustom = 'chain-ethereum-test-sepolia-custom',
    // polygon
    ChainPolygon = 'chain-polygon',
    ChainPolygonCustom = 'chain-polygon-custom',
    // polygon test amoy
    ChainPolygonTestSepolia = 'chain-polygon-test-amoy',
    ChainPolygonTestSepoliaCustom = 'chain-polygon-test-amoy-custom',
    // bsc
    ChainBsc = 'chain-bsc',
    ChainBscCustom = 'chain-bsc-custom',
    // bsc test
    ChainBscTestSepolia = 'chain-bsc-test',
    ChainBscTestSepoliaCustom = 'chain-bsc-test-custom',
}

export type CombinedTokenInfo =
    | { ic: IcTokenInfo }
    | { ethereum: EthereumTokenInfo }
    | { ethereum_test_sepolia: EthereumTestSepoliaTokenInfo }
    | { polygon: PolygonTokenInfo }
    | { polygon_test_amoy: PolygonTestAmoyTokenInfo }
    | { bsc: BscTokenInfo }
    | { bsc_test: BscTestTokenInfo };

export const match_combined_token_info = <T>(
    self: CombinedTokenInfo,
    {
        ic,
        ethereum,
        ethereum_test_sepolia,
        polygon,
        polygon_test_amoy,
        bsc,
        bsc_test,
    }: {
        ic: (ic: IcTokenInfo) => T;
        ethereum: (ethereum: EthereumTokenInfo) => T;
        ethereum_test_sepolia: (ethereum_test_sepolia: EthereumTestSepoliaTokenInfo) => T;
        polygon: (polygon: PolygonTokenInfo) => T;
        polygon_test_amoy: (polygon_test_amoy: PolygonTestAmoyTokenInfo) => T;
        bsc: (bsc: BscTokenInfo) => T;
        bsc_test: (bsc: BscTestTokenInfo) => T;
    },
): T => {
    if ('ic' in self) return ic(self.ic);
    if ('ethereum' in self) return ethereum(self.ethereum);
    if ('ethereum_test_sepolia' in self) return ethereum_test_sepolia(self.ethereum_test_sepolia);
    if ('polygon' in self) return polygon(self.polygon);
    if ('polygon_test_amoy' in self) return polygon_test_amoy(self.polygon_test_amoy);
    if ('bsc' in self) return bsc(self.bsc);
    if ('bsc_test' in self) return bsc_test(self.bsc_test);
    throw new Error('Unknown token info');
};
export const match_combined_token_info_async = async <T>(
    self: CombinedTokenInfo,
    {
        ic,
        ethereum,
        ethereum_test_sepolia,
        polygon,
        polygon_test_amoy,
        bsc,
        bsc_test,
    }: {
        ic: (ic: IcTokenInfo) => Promise<T>;
        ethereum: (ethereum: EthereumTokenInfo) => Promise<T>;
        ethereum_test_sepolia: (ethereum_test_sepolia: EthereumTestSepoliaTokenInfo) => Promise<T>;
        polygon: (polygon: PolygonTokenInfo) => Promise<T>;
        polygon_test_amoy: (polygon_test_amoy: PolygonTestAmoyTokenInfo) => Promise<T>;
        bsc: (bsc: BscTokenInfo) => Promise<T>;
        bsc_test: (bsc: BscTestTokenInfo) => Promise<T>;
    },
): Promise<T> => {
    if ('ic' in self) return ic(self.ic);
    if ('ethereum' in self) return ethereum(self.ethereum);
    if ('ethereum_test_sepolia' in self) return ethereum_test_sepolia(self.ethereum_test_sepolia);
    if ('polygon' in self) return polygon(self.polygon);
    if ('polygon_test_amoy' in self) return polygon_test_amoy(self.polygon_test_amoy);
    if ('bsc' in self) return bsc(self.bsc);
    if ('bsc_test' in self) return bsc_test(self.bsc_test);
    throw new Error('Unknown token info');
};

export interface TokenInfo {
    info: CombinedTokenInfo;
    tags: TokenTag[];
}

const get_token_main_address = (token: TokenInfo) => {
    return match_combined_token_info(token.info, {
        ic: (ic) => ic.canister_id,
        ethereum: (ethereum) => ethereum.address,
        ethereum_test_sepolia: (ethereum_test_sepolia) => ethereum_test_sepolia.address,
        polygon: (polygon) => polygon.address,
        polygon_test_amoy: (polygon_test_amoy) => polygon_test_amoy.address,
        bsc: (bsc) => bsc.address,
        bsc_test: (bsc_test) => bsc_test.address,
    });
};

export const is_same_token_info = (a: TokenInfo, b: TokenInfo): boolean => {
    if (Object.keys(a)[0] !== Object.keys(b)[0]) return false;
    return get_token_main_address(a) === get_token_main_address(b);
};
export const get_token_unique_id = (token: TokenInfo): string => {
    return match_combined_token_info(token.info, {
        ic: (ic) => `ic#${ic.canister_id}`,
        ethereum: (ethereum) => `ethereum#${ethereum.address}`,
        ethereum_test_sepolia: (ethereum_test_sepolia) => `ethereum_test_sepolia#${ethereum_test_sepolia.address}`,
        polygon: (polygon) => `polygon#${polygon.address}`,
        polygon_test_amoy: (polygon_test_amoy) => `polygon_test_amoy#${polygon_test_amoy.address}`,
        bsc: (bsc) => `bsc#${bsc.address}`,
        bsc_test: (bsc_test) => `bsc_test#${bsc_test.address}`,
    });
};
export const get_token_name = (token: TokenInfo): string => {
    return match_combined_token_info(token.info, {
        ic: (ic) => ic.name,
        ethereum: (ethereum) => ethereum.name,
        ethereum_test_sepolia: (ethereum_test_sepolia) => ethereum_test_sepolia.name,
        polygon: (polygon) => polygon.name,
        polygon_test_amoy: (polygon_test_amoy) => polygon_test_amoy.name,
        bsc: (bsc) => bsc.name,
        bsc_test: (bsc_test) => bsc_test.name,
    });
};
export const get_token_symbol = (token: TokenInfo): string => {
    return match_combined_token_info(token.info, {
        ic: (ic) => ic.symbol,
        ethereum: (ethereum) => ethereum.symbol,
        ethereum_test_sepolia: (ethereum_test_sepolia) => ethereum_test_sepolia.symbol,
        polygon: (polygon) => polygon.symbol,
        polygon_test_amoy: (polygon_test_amoy) => polygon_test_amoy.symbol,
        bsc: (bsc) => bsc.symbol,
        bsc_test: (bsc_test) => bsc_test.symbol,
    });
};

export interface CustomToken {
    created: number;
    updated: number;
    token: TokenInfo;
}

// <prefix>:token:info:custom => TokenInfo[]
export type CustomTokens = CustomToken[];

// <prefix>:token:info:current => TokenInfo[]
export type CurrentTokens = TokenInfo[];
