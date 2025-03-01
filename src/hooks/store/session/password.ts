import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { same } from '~lib/utils/same';

import { SESSION_KEY_PASSWORD } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_password = '';

// password -> // * session
export const usePasswordInner = (storage: Storage): [string, (value: string) => Promise<void>] => {
    const [password, setPassword] = useState(cached_password); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        const callback: StorageWatchCallback = (d) => {
            const password = d.newValue ?? '';
            if (!same(cached_password, password)) cached_password = password;
            setPassword(password);
        };
        storage.watch({ [SESSION_KEY_PASSWORD]: callback });
        return () => {
            storage.unwatch({ [SESSION_KEY_PASSWORD]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        storage.get<string>(SESSION_KEY_PASSWORD).then((data) => {
            if (data === undefined) data = cached_password;
            cached_password = data;
            setPassword(data);
        });
    }, [storage]);

    // update on this hook
    const updatePassword = useCallback(
        async (password: string) => {
            await storage.set(SESSION_KEY_PASSWORD, password);
            cached_password = password;
            setPassword(password);
        },
        [storage],
    );

    return [password, updatePassword];
};
