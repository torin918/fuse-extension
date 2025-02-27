import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { SESSION_KEY_RESTORE } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_restore = false;

// restore for options page -> // * session
export const useRestoreInner = (storage: Storage): [boolean, (value: boolean) => Promise<void>] => {
    const [restore, setRestore] = useState(cached_restore); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        const callback: StorageWatchCallback = (d) => {
            const restore = d.newValue ?? false;
            if (cached_restore !== restore) cached_restore = restore;
            setRestore(restore);
        };
        storage.watch({ [SESSION_KEY_RESTORE]: callback });
        return () => {
            storage.unwatch({ [SESSION_KEY_RESTORE]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        storage.get<boolean>(SESSION_KEY_RESTORE).then((data) => {
            if (data === undefined) data = cached_restore;
            cached_restore = data;
            setRestore(data);
        });
    }, [storage]);

    // update on this hook
    const updateRestore = useCallback(
        async (restore: boolean) => {
            await storage.set(SESSION_KEY_RESTORE, restore);
            cached_restore = restore;
            setRestore(restore);
        },
        [storage],
    );

    return [restore, updateRestore];
};
