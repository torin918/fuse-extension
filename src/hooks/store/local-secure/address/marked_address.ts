import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import { resort_list, type ResortFunction } from '~lib/utils/sort';
import { check_chain_address, type ChainAddress, type MarkedAddresses } from '~types/address';

import { LOCAL_SECURE_KEY_MARKED_ADDRESSES } from '../keys';

// ! always try to use this value to avoid BLINK
const DEFAULT_VALUE: MarkedAddresses = [];
let cached_marked_addresses: MarkedAddresses = DEFAULT_VALUE;

// marked addresses ->  // * local secure
export const useMarkedAddressesInner = (
    storage: SecureStorage | undefined,
): [
    MarkedAddresses,
    (value: MarkedAddresses) => Promise<void>,
    {
        pushOrUpdateMarkedAddress: (address: ChainAddress, name: string) => Promise<boolean | undefined>;
        removeMarkedAddress: (address: ChainAddress) => Promise<boolean | undefined>;
        resortMarkedAddresses: ResortFunction;
    },
] => {
    const [marked_addresses, setMarkedAddresses] = useState<MarkedAddresses>(cached_marked_addresses); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage) return;

        const callback: StorageWatchCallback = (d) => {
            const marked_addresses = d.newValue ?? DEFAULT_VALUE;
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
        if (!storage) return setMarkedAddresses((cached_marked_addresses = DEFAULT_VALUE)); // reset if locked

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
    // push or update
    const pushOrUpdateMarkedAddress = useCallback(
        async (address: ChainAddress, name: string) => {
            if (!storage || !marked_addresses) return undefined;

            if (!check_chain_address(address)) return false;

            name = name.trim();
            if (64 < name.length) return false;

            const now = Date.now();
            const exist = marked_addresses.find((a) => same(a.address, address));
            if (exist) {
                exist.name = name; // update
                exist.updated = now; // update
                await updateMarkedAddress([...marked_addresses]);
            } else {
                marked_addresses.push({ created: now, updated: now, name, address }); // push
                await updateMarkedAddress([...marked_addresses]);
            }

            return true;
        },
        [storage, marked_addresses, updateMarkedAddress],
    );
    // remove
    const removeMarkedAddress = useCallback(
        async (address: ChainAddress) => {
            if (!storage || !marked_addresses) return undefined;

            if (!check_chain_address(address)) return false;

            const exist = marked_addresses.find((a) => same(a.address, address));
            if (!exist) return false;

            const new_marked_addresses = marked_addresses.filter((a) => !same(a.address, address));
            await updateMarkedAddress(new_marked_addresses);

            return true;
        },
        [storage, marked_addresses, updateMarkedAddress],
    );
    // resort
    const resortMarkedAddresses = useCallback(
        async (source_index: number, destination_index: number | undefined) => {
            if (!storage || !marked_addresses) return undefined;

            const next = resort_list(marked_addresses, source_index, destination_index);
            if (typeof next === 'boolean') return next;

            await updateMarkedAddress(next);

            return true;
        },
        [storage, marked_addresses, updateMarkedAddress],
    );

    return [
        marked_addresses,
        updateMarkedAddress,
        { pushOrUpdateMarkedAddress, removeMarkedAddress, resortMarkedAddresses },
    ];
};
