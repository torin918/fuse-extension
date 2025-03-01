import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { same } from '~lib/utils/same';

import { LOCAL_KEY_WELCOMED } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_welcomed = true; // * welcome message cloud be skip

// check welcome page -> // * local
export const useWelcomedInner = (storage: Storage): [boolean, (value: boolean) => Promise<void>] => {
    const [welcomed, setWelcomed] = useState(cached_welcomed); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        const callback: StorageWatchCallback = (d) => {
            const welcomed = d.newValue ?? false;
            if (!same(cached_welcomed, welcomed)) cached_welcomed = welcomed;
            setWelcomed(welcomed);
        };
        storage.watch({ [LOCAL_KEY_WELCOMED]: callback });
        return () => {
            storage.unwatch({ [LOCAL_KEY_WELCOMED]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        storage.get<boolean>(LOCAL_KEY_WELCOMED).then((data) => {
            if (data === undefined) data = cached_welcomed;
            cached_welcomed = data;
            setWelcomed(data);
        });
    }, [storage]);

    // update on this hook
    const updateWelcomed = useCallback(
        async (welcomed: boolean) => {
            await storage.set(LOCAL_KEY_WELCOMED, welcomed);
            cached_welcomed = welcomed;
            setWelcomed(welcomed);
        },
        [storage],
    );

    return [welcomed, updateWelcomed];
};
