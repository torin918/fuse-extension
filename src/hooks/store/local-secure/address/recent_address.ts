import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import { check_chain_address, type ChainAddress, type RecentAddresses } from '~types/address';

import { LOCAL_SECURE_KEY_RECENT_ADDRESSES } from '../keys';

// ! always try to use this value to avoid BLINK
const DEFAULT_VALUE: RecentAddresses = [];
let cached_recent_addresses: RecentAddresses = DEFAULT_VALUE;

// recent addresses ->  // * local secure
export const useRecentAddressesInner = (
    storage: SecureStorage | undefined,
): [
    RecentAddresses,
    (value: RecentAddresses) => Promise<void>,
    { pushRecentAddress: (address: ChainAddress) => Promise<boolean | undefined> },
] => {
    const [recent_addresses, setRecentAddresses] = useState<RecentAddresses>(cached_recent_addresses); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage) return;

        const callback: StorageWatchCallback = (d) => {
            const recent_addresses = d.newValue ?? DEFAULT_VALUE;
            if (!same(cached_recent_addresses, recent_addresses)) cached_recent_addresses = recent_addresses;
            setRecentAddresses(recent_addresses);
        };
        storage.watch({ [LOCAL_SECURE_KEY_RECENT_ADDRESSES]: callback });
        return () => {
            storage.unwatch({ [LOCAL_SECURE_KEY_RECENT_ADDRESSES]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        if (!storage) return setRecentAddresses((cached_recent_addresses = DEFAULT_VALUE)); // reset if locked

        storage.get<RecentAddresses>(LOCAL_SECURE_KEY_RECENT_ADDRESSES).then((data) => {
            if (data === undefined) data = cached_recent_addresses;
            cached_recent_addresses = data;
            setRecentAddresses(data);
        });
    }, [storage]);

    // update on this hook
    const updateRecentAddress = useCallback(
        async (recent_addresses: RecentAddresses) => {
            if (!storage) return;

            await storage.set(LOCAL_SECURE_KEY_RECENT_ADDRESSES, recent_addresses);
            cached_recent_addresses = recent_addresses;
            setRecentAddresses(recent_addresses);
        },
        [storage],
    );
    // push
    const pushRecentAddress = useCallback(
        async (address: ChainAddress) => {
            if (!storage || !recent_addresses) return undefined;

            if (!check_chain_address(address)) return false;

            const new_recent_addresses = recent_addresses.filter((a) => !same(a.address, address));
            new_recent_addresses.push({ created: Date.now(), address });

            // ? Remove previous addresses

            await updateRecentAddress(recent_addresses);
            return true;
        },
        [storage, recent_addresses, updateRecentAddress],
    );

    return [recent_addresses, updateRecentAddress, { pushRecentAddress }];
};
