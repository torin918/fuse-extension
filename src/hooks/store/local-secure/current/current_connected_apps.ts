import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { same } from '~lib/utils/same';
import { match_chain, match_chain_async, type Chain } from '~types/chain';
import {
    DEFAULT_CURRENT_CONNECTED_APPS,
    update_connected_app,
    type ConnectedApp,
    type ConnectedApps,
    type CurrentConnectedApps,
} from '~types/connect';
import type { IdentityId } from '~types/identity';
import type { CurrentChainNetwork } from '~types/network';

import { LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_current_connected_apps: CurrentConnectedApps = DEFAULT_CURRENT_CONNECTED_APPS;

// current connected apps ->  // * local secure
export const useCurrentConnectedAppsInner = (
    storage: SecureStorage | undefined,
    current_identity: IdentityId | undefined,
    current_chain_network: CurrentChainNetwork,
): [
    CurrentConnectedApps,
    (value: CurrentConnectedApps) => Promise<void>,
    {
        current_identity: IdentityId | undefined;
        current_chain_network: CurrentChainNetwork;
        pushOrUpdateConnectedApp: (chain: Chain, app: ConnectedApp) => Promise<void>;
    },
] => {
    const [current_connected_apps, setCurrentConnectedApps] =
        useState<CurrentConnectedApps>(cached_current_connected_apps); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!storage || !current_identity || !current_chain_network) return;
        if (!current_connected_apps) return; // ! MUST CHECK THEN UPDATE
        const current_ic_connected_apps_callback: StorageWatchCallback = (d) => {
            const current_ic_connected_apps = d.newValue ?? [];
            if (!same(current_connected_apps.ic, current_ic_connected_apps)) {
                setCurrentConnectedApps({ ...current_connected_apps, ic: current_ic_connected_apps });
            }
        };
        const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(current_identity, current_chain_network.ic);
        storage.watch({ [key_ic]: current_ic_connected_apps_callback });
        return () => {
            storage.unwatch({ [key_ic]: current_ic_connected_apps_callback });
        };
    }, [storage, current_identity, current_chain_network, current_connected_apps]);

    // init on this hook
    useEffect(() => {
        if (!storage || !current_identity || !current_chain_network)
            return setCurrentConnectedApps(DEFAULT_CURRENT_CONNECTED_APPS);
        if (!current_connected_apps) return; // ! MUST CHECK THEN UPDATE
        const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(current_identity, current_chain_network.ic);
        (async () => {
            let data_ic = await storage.get<ConnectedApps>(key_ic);
            if (data_ic === undefined) data_ic = [];
            const new_current_connected_apps = { ...cached_current_connected_apps, ic: data_ic };
            if (!same(new_current_connected_apps, current_connected_apps)) {
                cached_current_connected_apps = new_current_connected_apps;
                setCurrentConnectedApps(cached_current_connected_apps); // ! MUST CHECK THEN UPDATE
            }
        })();
    }, [storage, current_identity, current_chain_network, current_connected_apps]);

    // update on this hook
    const updateCurrentConnectedApps = useCallback(
        async (connected_apps: CurrentConnectedApps) => {
            if (!storage || !current_identity || !current_chain_network)
                return setCurrentConnectedApps(DEFAULT_CURRENT_CONNECTED_APPS);

            let changed = false;

            if (!same(current_connected_apps.ic, connected_apps.ic)) {
                const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(current_identity, current_chain_network.ic);
                await storage.set(key_ic, connected_apps.ic);
                changed = true;
            }

            if (changed) {
                cached_current_connected_apps = connected_apps;
                setCurrentConnectedApps(connected_apps);
            }
        },
        [storage, current_identity, current_chain_network, current_connected_apps],
    );
    // update single
    const pushOrUpdateConnectedApp = useCallback(
        async (chain: Chain, app: ConnectedApp) => {
            if (!storage || !current_identity || !current_chain_network) return;
            if (!current_connected_apps) return;
            const new_current_connected_apps = await push_or_update_connected_app(
                chain,
                app,
                storage,
                current_identity,
                current_chain_network,
                current_connected_apps,
            );
            if (!same(new_current_connected_apps, current_connected_apps)) {
                updateCurrentConnectedApps(new_current_connected_apps);
            }
        },
        [storage, current_identity, current_chain_network, current_connected_apps, updateCurrentConnectedApps],
    );

    return [
        current_connected_apps,
        updateCurrentConnectedApps,
        { current_identity, current_chain_network, pushOrUpdateConnectedApp },
    ];
};

const push_or_update_connected_app = async (
    chain: Chain,
    app: ConnectedApp,
    storage: SecureStorage,
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    current_connected_apps: CurrentConnectedApps,
): Promise<CurrentConnectedApps> => {
    const apps = [
        ...match_chain(chain, {
            ic: () => current_connected_apps.ic,
        }),
    ];
    const a = apps.find((a) => a.origin === app.origin);
    if (a !== undefined) update_connected_app(a, app);
    else apps.push(app);
    return await match_chain_async(chain, {
        ic: async () => {
            const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(current_identity, current_chain_network.ic);
            await storage.set(key_ic, apps);
            const new_current_connected_apps: CurrentConnectedApps = { ...current_connected_apps, ic: apps };
            return new_current_connected_apps;
        },
    });
};
