import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import { type PrivateKeys } from '~types/identity';

import { LOCAL_SECURE_KEY_PRIVATE_KEYS } from './keys';

// ! always try to use this value to avoid BLINK
let cached_private_keys: PrivateKeys | undefined = undefined;

// private keys ->  // * local secure
export const usePrivateKeysInner = (
    storage: SecureStorage | undefined,
): [PrivateKeys | undefined, (value: PrivateKeys) => Promise<void>] => {
    const [private_keys, setPrivateKeys] = useState<PrivateKeys | undefined>(cached_private_keys); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage) return;
        const callback: StorageWatchCallback = (d) => {
            const private_keys = d.newValue;
            if (!same(cached_private_keys, private_keys)) cached_private_keys = private_keys;
            setPrivateKeys(private_keys);
        };
        storage.watch({ [LOCAL_SECURE_KEY_PRIVATE_KEYS]: callback });
        return () => {
            storage.unwatch({ [LOCAL_SECURE_KEY_PRIVATE_KEYS]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        if (!storage) return setPrivateKeys(undefined); // reset if locked
        storage.get<PrivateKeys>(LOCAL_SECURE_KEY_PRIVATE_KEYS).then((data) => {
            if (data === undefined) data = cached_private_keys;
            cached_private_keys = data;
            setPrivateKeys(data);
        });
    }, [storage]);

    // update on this hook
    const updatePrivateKeys = useCallback(
        async (private_keys: PrivateKeys) => {
            if (!storage) return;
            await storage.set(LOCAL_SECURE_KEY_PRIVATE_KEYS, private_keys);
            cached_private_keys = private_keys;
            setPrivateKeys(private_keys);
        },
        [storage],
    );

    return [private_keys, updatePrivateKeys];
};
