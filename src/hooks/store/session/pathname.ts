import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { SESSION_KEY_PATHNAME } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_pathname = '';

// pathname for check transition of pages -> // * session
export const usePathnameInner = (storage: Storage): [string, (value: string) => Promise<void>] => {
    const [pathname, setPathname] = useState(cached_pathname); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        const callback: StorageWatchCallback = (d) => {
            const pathname = d.newValue ?? '';
            if (cached_pathname !== pathname) cached_pathname = pathname;
            setPathname(pathname);
        };
        storage.watch({ [SESSION_KEY_PATHNAME]: callback });
        return () => {
            storage.unwatch({ [SESSION_KEY_PATHNAME]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        storage.get<string>(SESSION_KEY_PATHNAME).then((data) => {
            if (data === undefined) data = cached_pathname;
            cached_pathname = data;
            setPathname(data);
        });
    }, [storage]);

    // update on this hook
    const updatePathname = useCallback(
        async (pathname: string) => {
            await storage.set(SESSION_KEY_PATHNAME, pathname);
            cached_pathname = pathname;
            setPathname(pathname);
        },
        [storage],
    );

    return [pathname, updatePathname];
};
