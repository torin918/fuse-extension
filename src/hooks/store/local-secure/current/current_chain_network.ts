import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import type { IdentityId } from '~types/identity';
import { DEFAULT_CURRENT_CHAIN_NETWORK, type CurrentChainNetwork } from '~types/network';

import { LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK } from '../keys';

// ! always try to use this value to avoid BLINK
const DEFAULT_VALUE: CurrentChainNetwork = DEFAULT_CURRENT_CHAIN_NETWORK;
let cached_current_chain_network: CurrentChainNetwork = DEFAULT_VALUE;

// current chain network ->  // * local secure
export const useCurrentChainNetworkInner = (
    storage: SecureStorage | undefined,
    current_identity: IdentityId | undefined,
): [CurrentChainNetwork, (value: CurrentChainNetwork) => Promise<void>] => {
    const [current_chain_network, setCurrentChaiNetwork] = useState<CurrentChainNetwork>(cached_current_chain_network); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage || !current_identity) return;

        const callback: StorageWatchCallback = (d) => {
            const current_chain_network = d.newValue ?? DEFAULT_VALUE;
            if (!same(cached_current_chain_network, current_chain_network)) {
                cached_current_chain_network = current_chain_network;
            }
            setCurrentChaiNetwork(current_chain_network);
        };
        const key = LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(current_identity);
        storage.watch({ [key]: callback });
        return () => {
            storage.unwatch({ [key]: callback });
        };
    }, [storage, current_identity]);

    // init on this hook
    useEffect(() => {
        if (!storage || !current_identity) return setCurrentChaiNetwork((cached_current_chain_network = DEFAULT_VALUE));

        const key = LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(current_identity);
        storage.get<CurrentChainNetwork>(key).then((data) => {
            if (data === undefined) data = cached_current_chain_network;
            cached_current_chain_network = data;
            setCurrentChaiNetwork(data);
        });
    }, [storage, current_identity]);

    // update on this hook
    const updateCurrentChainNetwork = useCallback(
        async (current_chain_network: CurrentChainNetwork) => {
            if (!storage || !current_identity) return;

            const key = LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(current_identity);
            await storage.set(key, current_chain_network);
            cached_current_chain_network = current_chain_network;
            setCurrentChaiNetwork(current_chain_network);
        },
        [storage, current_identity],
    );

    return [current_chain_network, updateCurrentChainNetwork];
};
