import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { same } from '~lib/utils/same';

import { LOCAL_KEY_PASSWORD_HASHED } from '../keys';

// ! always try to use this value to avoid BLINK
const DEFAULT_VALUE = '';
let cached_password_hashed = DEFAULT_VALUE;

// check password -> // * local
export const usePasswordHashedInner = (storage: Storage): [string, (value: string) => Promise<void>] => {
    const [password_hashed, setPasswordHashed] = useState(cached_password_hashed); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage) return;

        const callback: StorageWatchCallback = (d) => {
            const password_hashed = d.newValue ?? DEFAULT_VALUE;
            if (!same(cached_password_hashed, password_hashed)) cached_password_hashed = password_hashed;
            setPasswordHashed(password_hashed);
        };
        storage.watch({ [LOCAL_KEY_PASSWORD_HASHED]: callback });
        return () => {
            storage.unwatch({ [LOCAL_KEY_PASSWORD_HASHED]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        if (!storage) return setPasswordHashed((cached_password_hashed = DEFAULT_VALUE));

        storage.get<string>(LOCAL_KEY_PASSWORD_HASHED).then((data) => {
            if (data === undefined) data = cached_password_hashed;
            cached_password_hashed = data;
            setPasswordHashed(data);
        });
    }, [storage]);

    // update on this hook
    const updatePasswordHashed = useCallback(
        async (password_hashed: string) => {
            if (!storage) return;

            await storage.set(LOCAL_KEY_PASSWORD_HASHED, password_hashed);
            cached_password_hashed = password_hashed;
            setPasswordHashed(password_hashed);
        },
        [storage],
    );

    return [password_hashed, updatePasswordHashed];
};
