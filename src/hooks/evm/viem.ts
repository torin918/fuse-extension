import { useMemo } from 'react';
import { createPublicClient, http, type PublicClient, type Chain as ViemChain } from 'viem';
import { bsc, bscTestnet, mainnet, polygon, polygonAmoy, sepolia } from 'viem/chains';

import { useCurrentChainNetwork, useCurrentIdentity } from '~hooks/store/local-secure';
import { match_chain, type EvmChain, type EvmChainTest } from '~types/chain';
import {
    DEFAULT_CURRENT_CHAIN_EVM_NETWORK,
    get_default_rpc,
    get_identity_network_key,
    type ChainIcIdentityNetwork,
    type ChainNetwork,
    type IdentityNetwork,
} from '~types/network';
import type { ChainIcNetwork } from '~types/network/ic';

export const SHOULD_DEHYDRATE_QUERY_KEY = 'SHOULD_DEHYDRATE';

export const get_chain_by_chain_id = (chainId: number): EvmChain | EvmChainTest | undefined => {
    return Object.entries(DEFAULT_CURRENT_CHAIN_EVM_NETWORK).find(([, network]) => network.chain_id === chainId)?.[1]
        .chain;
};
export const get_viem_chain_by_chain = (chain: EvmChain) => {
    return match_chain<ViemChain>(chain, {
        ic: () => {
            throw new Error('IC chain is not supported');
        },
        ethereum: () => mainnet,
        ethereum_test_sepolia: () => sepolia,
        polygon: () => polygon,
        polygon_test_amoy: () => polygonAmoy,
        bsc: () => bsc,
        bsc_test: () => bscTestnet,
    });
};

export const useEvmChainNetworkByChain = (chain: EvmChain) => {
    const current_chain_network = useCurrentChainNetwork();
    return match_chain<Exclude<ChainNetwork, ChainIcNetwork>>(chain, {
        ic: () => {
            throw new Error('IC chain is not supported');
        },
        ethereum: () => current_chain_network.ethereum,
        ethereum_test_sepolia: () => current_chain_network.ethereum_test_sepolia,
        polygon: () => current_chain_network.polygon,
        polygon_test_amoy: () => current_chain_network.polygon_test_amoy,
        bsc: () => current_chain_network.bsc,
        bsc_test: () => current_chain_network.bsc_test,
    });
};

export const useEvmChainIdentityNetworkByChain = (chain: EvmChain) => {
    const { current_identity_network } = useCurrentIdentity();
    if (!current_identity_network) return undefined;
    return match_chain<Exclude<IdentityNetwork, ChainIcIdentityNetwork> | undefined>(chain, {
        ic: () => {
            throw new Error('IC chain is not supported');
        },
        ethereum: () => current_identity_network.ethereum,
        ethereum_test_sepolia: () => current_identity_network.ethereum_test_sepolia,
        polygon: () => current_identity_network.polygon,
        polygon_test_amoy: () => current_identity_network.polygon_test_amoy,
        bsc: () => current_identity_network.bsc,
        bsc_test: () => current_identity_network.bsc_test,
    });
};

export const useEvmChainIdentityNetworkKeyByChain = (chain: EvmChain) => {
    const identity_network = useEvmChainIdentityNetworkByChain(chain);
    if (!identity_network) return undefined;
    return get_identity_network_key(identity_network);
};

// Store clients in a Map with composite key `${chainId}-${rpc}`
const clients = new Map<string, PublicClient>();

export const usePublicClientByChain = (chain: EvmChain): PublicClient => {
    const chain_network = useEvmChainNetworkByChain(chain);
    const rpc = chain_network.rpc === 'mainnet' ? get_default_rpc(chain) : chain_network.rpc;
    const client = useMemo(() => {
        // Create a cache key combining chainId and rpc
        const cacheKey = `${chain}-${rpc}`;

        // Check if client exists in cache
        const existingClient = clients.get(cacheKey);
        if (existingClient) {
            return existingClient;
        }

        // Get chain configuration
        const viem_chain = get_viem_chain_by_chain(chain);

        // Create a new client with the current RPC
        const newClient = createPublicClient({
            chain: viem_chain,
            transport: http(rpc),
        });

        // Update cache with new client
        clients.set(cacheKey, newClient);

        return newClient;
    }, [chain, rpc]);

    return client;
};
