import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import type { ChainNetworks } from '~types/network';

import { LOCAL_SECURE_KEY_CHAIN_NETWORKS } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_chain_networks: ChainNetworks = [];

// chain networks ->  // * local secure
export const useChainNetworksInner = (
    storage: SecureStorage | undefined,
): [ChainNetworks, (value: ChainNetworks) => Promise<void>] => {
    const [chain_networks, setChainNetworks] = useState<ChainNetworks>(cached_chain_networks); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage) return;
        const chain_networks_callback: StorageWatchCallback = (d) => {
            const chain_networks = d.newValue ?? [];
            if (!same(cached_chain_networks, chain_networks)) cached_chain_networks = chain_networks;
            setChainNetworks(chain_networks);
        };
        storage.watch({ [LOCAL_SECURE_KEY_CHAIN_NETWORKS]: chain_networks_callback });
        return () => {
            storage.unwatch({ [LOCAL_SECURE_KEY_CHAIN_NETWORKS]: chain_networks_callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        if (!storage) return setChainNetworks([]);
        storage.get<ChainNetworks>(LOCAL_SECURE_KEY_CHAIN_NETWORKS).then((data) => {
            if (data === undefined) data = cached_chain_networks;
            cached_chain_networks = data;
            setChainNetworks(data);
        });
    }, [storage]);

    // update on this hook
    const updateChainNetworks = useCallback(
        async (chain_networks: ChainNetworks) => {
            if (!storage) return;
            await storage.set(LOCAL_SECURE_KEY_CHAIN_NETWORKS, chain_networks);
            cached_chain_networks = chain_networks;
            setChainNetworks(chain_networks);
        },
        [storage],
    );

    return [chain_networks, updateChainNetworks];
};
