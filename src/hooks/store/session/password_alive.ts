import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { SESSION_KEY_PASSWORD_ALIVE } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_password_alive = Date.now();

// password alive -> // * session
export const usePasswordAliveInner = (storage: Storage): [number, (value: number) => Promise<void>] => {
    const [password_alive, setPasswordAlive] = useState(cached_password_alive); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        const callback: StorageWatchCallback = (d) => {
            const password_alive = d.newValue ?? 0;
            if (cached_password_alive !== password_alive) cached_password_alive = password_alive;
            setPasswordAlive(password_alive);
        };
        storage.watch({ [SESSION_KEY_PASSWORD_ALIVE]: callback });
        return () => {
            storage.unwatch({ [SESSION_KEY_PASSWORD_ALIVE]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        storage.get<number>(SESSION_KEY_PASSWORD_ALIVE).then((data) => {
            if (data === undefined) data = cached_password_alive;
            cached_password_alive = data;
            setPasswordAlive(data);
        });
    }, [storage]);

    // update on this hook
    const updatePasswordAlive = useCallback(
        async (password_alive: number) => {
            await storage.set(SESSION_KEY_PASSWORD_ALIVE, password_alive);
            cached_password_alive = password_alive;
            setPasswordAlive(password_alive);
        },
        [storage],
    );

    return [password_alive, updatePasswordAlive];
};
