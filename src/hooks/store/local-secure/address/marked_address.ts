import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import type { MarkedAddresses } from '~types/address';

import { LOCAL_SECURE_KEY_MARKED_ADDRESSES } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_marked_addresses: MarkedAddresses = [];

// marked addresses ->  // * local secure
export const useMarkedAddressesInner = (
    storage: SecureStorage | undefined,
): [MarkedAddresses | undefined, (value: MarkedAddresses) => Promise<void>] => {
    const [marked_addresses, setMarkedAddresses] = useState<MarkedAddresses | undefined>(cached_marked_addresses); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage) return;
        const callback: StorageWatchCallback = (d) => {
            const marked_addresses = d.newValue ?? [];
            if (!same(cached_marked_addresses, marked_addresses)) cached_marked_addresses = marked_addresses;
            setMarkedAddresses(marked_addresses);
        };
        storage.watch({ [LOCAL_SECURE_KEY_MARKED_ADDRESSES]: callback });
        return () => {
            storage.unwatch({ [LOCAL_SECURE_KEY_MARKED_ADDRESSES]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        if (!storage) return setMarkedAddresses(undefined); // reset if locked
        storage.get<MarkedAddresses>(LOCAL_SECURE_KEY_MARKED_ADDRESSES).then((data) => {
            if (data === undefined) data = cached_marked_addresses;
            cached_marked_addresses = data;
            setMarkedAddresses(data);
        });
    }, [storage]);

    // update on this hook
    const updateMarkedAddress = useCallback(
        async (marked_addresses: MarkedAddresses) => {
            if (!storage) return;
            await storage.set(LOCAL_SECURE_KEY_MARKED_ADDRESSES, marked_addresses);
            cached_marked_addresses = marked_addresses;
            setMarkedAddresses(marked_addresses);
        },
        [storage],
    );

    return [marked_addresses, updateMarkedAddress];
};
