import type { ChainBscNetwork } from './bsc';
import type { ChainBscTestNetwork } from './bsc-test';
import type { ChainEthereumNetwork } from './ethereum';
import type { ChainEthereumTestSepoliaNetwork } from './ethereum-test-sepolia';
import { CHAIN_IC_MAINNET, type ChainIcNetwork } from './ic';
import type { ChainPolygonNetwork } from './polygon';
import type { ChainPolygonTestAmoyNetwork } from './polygon-test-amoy';

export type ChainNetwork =
    | ChainIcNetwork
    | ChainEthereumNetwork
    | ChainEthereumTestSepoliaNetwork
    | ChainPolygonNetwork
    | ChainPolygonTestAmoyNetwork
    | ChainBscNetwork
    | ChainBscTestNetwork;

export type ChainNetworks = ChainNetwork[]; // user added networks

export type CurrentChainNetwork =
    | { ic: ChainIcNetwork }
    | { ethereum: ChainEthereumNetwork }
    | { ethereum_test_sepolia: ChainEthereumTestSepoliaNetwork }
    | { polygon: ChainPolygonNetwork }
    | { polygon_test_amoy: ChainPolygonTestAmoyNetwork }
    | { bsc: ChainBscNetwork }
    | { bsc_test: ChainBscTestNetwork };

export const DEFAULT_CURRENT_CHAIN_NETWORK: CurrentChainNetwork = { ic: CHAIN_IC_MAINNET };

// =================== chain identity network ===================

export interface ChainIcIdentityNetwork {
    chain: 'ic';
    owner: string;
    network: ChainIcNetwork;
}

export interface ChainEthereumIdentityNetwork {
    chain: 'ethereum';
    address: string;
    network: ChainEthereumNetwork;
}

export interface ChainEthereumTestSepoliaIdentityNetwork {
    chain: 'ethereum-test-sepolia';
    address: string;
    network: ChainEthereumTestSepoliaNetwork;
}

export interface ChainPolygonIdentityNetwork {
    chain: 'polygon';
    address: string;
    network: ChainPolygonNetwork;
}

export interface ChainPolygonTestAmoyIdentityNetwork {
    chain: 'polygon-test-amoy';
    address: string;
    network: ChainPolygonTestAmoyNetwork;
}

export interface ChainBscIdentityNetwork {
    chain: 'bsc';
    address: string;
    network: ChainBscNetwork;
}

export interface ChainBscTestIdentityNetwork {
    chain: 'bsc-test';
    address: string;
    network: ChainBscTestNetwork;
}

export type IdentityNetwork =
    | ChainIcIdentityNetwork
    | ChainEthereumIdentityNetwork
    | ChainEthereumTestSepoliaIdentityNetwork
    | ChainPolygonIdentityNetwork
    | ChainPolygonTestAmoyIdentityNetwork
    | ChainBscIdentityNetwork
    | ChainBscTestIdentityNetwork;

export const match_identity_network = <T>(
    self: IdentityNetwork,
    {
        ic,
        ethereum,
        ethereum_test_sepolia,
        polygon,
        polygon_test_amoy,
        bsc,
        bsc_test,
    }: {
        ic: (ic: ChainIcIdentityNetwork) => T;
        ethereum: (ethereum: ChainEthereumIdentityNetwork) => T;
        ethereum_test_sepolia: (ethereum_test_sepolia: ChainEthereumTestSepoliaIdentityNetwork) => T;
        polygon: (polygon: ChainPolygonIdentityNetwork) => T;
        polygon_test_amoy: (polygon_test_amoy: ChainPolygonTestAmoyIdentityNetwork) => T;
        bsc: (bsc: ChainBscIdentityNetwork) => T;
        bsc_test: (bsc_test: ChainBscTestIdentityNetwork) => T;
    },
): T => {
    if (self.chain === 'ic') return ic(self);
    if (self.chain === 'ethereum') return ethereum(self);
    if (self.chain === 'ethereum-test-sepolia') return ethereum_test_sepolia(self);
    if (self.chain === 'polygon') return polygon(self);
    if (self.chain === 'polygon-test-amoy') return polygon_test_amoy(self);
    if (self.chain === 'bsc') return bsc(self);
    if (self.chain === 'bsc-test') return bsc_test(self);
    throw new Error(`Unknown identity network: ${JSON.stringify(self)}`);
};
export const match_identity_network_async = async <T>(
    self: IdentityNetwork,
    {
        ic,
        ethereum,
        ethereum_test_sepolia,
        polygon,
        polygon_test_amoy,
        bsc,
        bsc_test,
    }: {
        ic: (ic: ChainIcIdentityNetwork) => Promise<T>;
        ethereum: (ethereum: ChainEthereumIdentityNetwork) => Promise<T>;
        ethereum_test_sepolia: (ethereum_test_sepolia: ChainEthereumTestSepoliaIdentityNetwork) => Promise<T>;
        polygon: (polygon: ChainPolygonIdentityNetwork) => Promise<T>;
        polygon_test_amoy: (polygon_test_amoy: ChainPolygonTestAmoyIdentityNetwork) => Promise<T>;
        bsc: (bsc: ChainBscIdentityNetwork) => Promise<T>;
        bsc_test: (bsc_test: ChainBscTestIdentityNetwork) => Promise<T>;
    },
): Promise<T> => {
    if (self.chain === 'ic') return ic(self);
    if (self.chain === 'ethereum') return ethereum(self);
    if (self.chain === 'ethereum-test-sepolia') return ethereum_test_sepolia(self);
    if (self.chain === 'polygon') return polygon(self);
    if (self.chain === 'polygon-test-amoy') return polygon_test_amoy(self);
    if (self.chain === 'bsc') return bsc(self);
    if (self.chain === 'bsc-test') return bsc_test(self);
    throw new Error(`Unknown identity network: ${JSON.stringify(self)}`);
};

export const get_identity_network_key = (identity_network: IdentityNetwork): string => {
    return match_identity_network(identity_network, {
        ic: (ic) => `${ic.chain}:${ic.owner}:${ic.network.origin}`,
        ethereum: (ethereum) => `${ethereum.chain}:${ethereum.address}:${ethereum.network.rpc}`,
        ethereum_test_sepolia: (ethereum_test_sepolia) =>
            `${ethereum_test_sepolia.chain}:${ethereum_test_sepolia.address}:${ethereum_test_sepolia.network.rpc}`,
        polygon: (polygon) => `${polygon.chain}:${polygon.address}:${polygon.network.rpc}`,
        polygon_test_amoy: (polygon_test_amoy) =>
            `${polygon_test_amoy.chain}:${polygon_test_amoy.address}:${polygon_test_amoy.network.rpc}`,
        bsc: (bsc) => `${bsc.chain}:${bsc.address}:${bsc.network.rpc}`,
        bsc_test: (bsc_test) => `${bsc_test.chain}:${bsc_test.address}:${bsc_test.network.rpc}`,
    });
};

// current
export interface CurrentIdentityNetwork {
    ic?: ChainIcIdentityNetwork;
    ethereum?: ChainEthereumIdentityNetwork;
    ethereum_test_sepolia?: ChainEthereumTestSepoliaIdentityNetwork;
    polygon?: ChainPolygonIdentityNetwork;
    polygon_test_amoy?: ChainPolygonTestAmoyIdentityNetwork;
    bsc?: ChainBscIdentityNetwork;
    bsc_test?: ChainBscTestIdentityNetwork;
}
