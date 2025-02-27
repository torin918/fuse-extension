import { useCallback, useEffect, useState } from 'react';

import type { StorageWatchCallback } from '@plasmohq/storage';
import type { SecureStorage } from '@plasmohq/storage/secure';

import { get_address_by_mnemonic } from '~lib/mnemonic';
import { same } from '~lib/utils/same';
import { match_chain, match_chain_async, type Chain } from '~types/chain';
import {
    DEFAULT_CURRENT_CONNECTED_APPS,
    update_connected_app,
    type ConnectedApp,
    type ConnectedApps,
    type CurrentConnectedApps,
} from '~types/connect';
import {
    match_combined_identity_key,
    type IdentityAddress,
    type IdentityId,
    type IdentityKey,
    type PrivateKeys,
} from '~types/identity';
import { DEFAULT_CURRENT_CHAIN_NETWORK, type ChainNetworks, type CurrentChainNetwork } from '~types/network';

import { usePassword } from '..';
import { agent_refresh_unique_identity } from '../agent';
import {
    LOCAL_SECURE_KEY_CHAIN_NETWORKS,
    LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK,
    LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS,
    LOCAL_SECURE_KEY_PRIVATE_KEYS,
} from '../keys';

// ! always try to use this value to avoid BLINK
let cached_private_keys: PrivateKeys | undefined = undefined;
let cached_chain_networks: ChainNetworks = [];
let cached_current_chain_network: CurrentChainNetwork = DEFAULT_CURRENT_CHAIN_NETWORK;
let cached_current_connected_apps: CurrentConnectedApps = DEFAULT_CURRENT_CONNECTED_APPS;

// private keys ->  // * local secure
export const useSecuredDataInner = (
    secure_storage: SecureStorage,
): {
    // private_keys: PrivateKeys | undefined;
    chain_networks: ChainNetworks | undefined;
    current_chain_network: CurrentChainNetwork | undefined;
    current_connected_apps: CurrentConnectedApps | undefined;
    current_address: IdentityAddress | undefined;
    current_identity: IdentityId | undefined;
    pushOrUpdateConnectedApp: (chain: Chain, app: ConnectedApp) => Promise<void>;
} => {
    const [password] = usePassword();
    const [storage, setStorage] = useState<SecureStorage>();
    useEffect(() => {
        if (!password) return setStorage(undefined);
        secure_storage.setPassword(password).then(() => {
            setStorage(secure_storage);
        });
    }, [secure_storage, password]);

    const [private_keys, setPrivateKeys] = useState<PrivateKeys | undefined>(cached_private_keys); // use cached value to init
    const [chain_networks, setChainNetworks] = useState<ChainNetworks>(cached_chain_networks); // use cached value to init
    const [current_chain_network, setCurrentChaiNetwork] = useState<CurrentChainNetwork>(cached_current_chain_network); // use cached value to init
    const [current_connected_apps, setCurrentConnectedApps] =
        useState<CurrentConnectedApps>(cached_current_connected_apps); // use cached value to init

    // reset if locked
    useEffect(() => {
        if (!password || !storage) {
            setPrivateKeys(undefined);
            setChainNetworks([]);
            setCurrentChaiNetwork(DEFAULT_CURRENT_CHAIN_NETWORK);
            setCurrentConnectedApps(DEFAULT_CURRENT_CONNECTED_APPS);
        }
    }, [password, storage]);

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        if (!password || !storage) return;
        const private_keys_callback: StorageWatchCallback = (d) => {
            const private_keys = d.newValue;
            if (cached_private_keys !== private_keys) cached_private_keys = private_keys;
            setPrivateKeys(private_keys);
        };
        storage.watch({ [LOCAL_SECURE_KEY_PRIVATE_KEYS]: private_keys_callback });
        return () => {
            storage.unwatch({ [LOCAL_SECURE_KEY_PRIVATE_KEYS]: private_keys_callback });
        };
    }, [password, storage]);
    useEffect(() => {
        if (!password || !storage) return;
        const chain_networks_callback: StorageWatchCallback = (d) => {
            const chain_networks = d.newValue ?? [];
            if (!same(cached_chain_networks, chain_networks)) cached_chain_networks = chain_networks;
            setChainNetworks(chain_networks);
        };
        storage.watch({ [LOCAL_SECURE_KEY_CHAIN_NETWORKS]: chain_networks_callback });
        return () => {
            storage.unwatch({ [LOCAL_SECURE_KEY_CHAIN_NETWORKS]: chain_networks_callback });
        };
    }, [password, storage]);
    useEffect(() => {
        if (!password || !storage) return;
        if (!private_keys) return;
        const current_chain_network_callback: StorageWatchCallback = (d) => {
            const current_chain_network = d.newValue ?? DEFAULT_CURRENT_CHAIN_NETWORK;
            if (!same(cached_current_chain_network, current_chain_network)) {
                cached_current_chain_network = current_chain_network;
            }
            setCurrentChaiNetwork(current_chain_network);
        };
        const key = LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(private_keys.current);
        storage.watch({ [key]: current_chain_network_callback });
        return () => {
            storage.unwatch({ [key]: current_chain_network_callback });
        };
    }, [password, storage, private_keys]);
    useEffect(() => {
        if (!password || !storage) return;
        if (!private_keys) return;
        if (!current_chain_network) return;
        if (!current_connected_apps) return;
        const current_ic_connected_apps_callback: StorageWatchCallback = (d) => {
            if (!same(current_connected_apps.ic, d.newValue)) {
                setCurrentConnectedApps({ ...current_connected_apps, ic: d.newValue });
            }
        };
        const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(private_keys.current, current_chain_network.ic);
        storage.watch({ [key_ic]: current_ic_connected_apps_callback });
        return () => {
            storage.unwatch({ [key_ic]: current_ic_connected_apps_callback });
        };
    }, [password, storage, private_keys, current_chain_network, current_connected_apps]);

    // init on this hook
    useEffect(() => {
        if (!password || !storage) return;
        storage.get<PrivateKeys>(LOCAL_SECURE_KEY_PRIVATE_KEYS).then((data) => {
            if (data === undefined) data = cached_private_keys;
            cached_private_keys = data;
            setPrivateKeys(data);
        });
    }, [password, storage]);
    useEffect(() => {
        if (!password || !storage) return;
        storage.get<ChainNetworks>(LOCAL_SECURE_KEY_CHAIN_NETWORKS).then((data) => {
            if (data === undefined) data = cached_chain_networks;
            cached_chain_networks = data;
            setChainNetworks(data);
        });
    }, [password, storage]);
    useEffect(() => {
        if (!password || !storage) return;
        if (!private_keys) return;
        const key = LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(private_keys.current);
        storage.get<CurrentChainNetwork>(key).then((data) => {
            if (data === undefined) data = cached_current_chain_network;
            cached_current_chain_network = data;
            setCurrentChaiNetwork(data);
        });
    }, [password, storage, private_keys]);
    useEffect(() => {
        if (!password || !storage) return;
        if (!private_keys) return;
        if (!current_chain_network) return;
        if (!current_connected_apps) return;
        const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(private_keys.current, current_chain_network.ic);
        (async () => {
            let data_ic = await storage.get<ConnectedApps>(key_ic);
            if (data_ic === undefined) data_ic = [];
            const new_current_connected_apps = { ...cached_current_connected_apps, ic: data_ic };
            if (!same(new_current_connected_apps, current_connected_apps)) {
                cached_current_connected_apps = new_current_connected_apps;
                setCurrentConnectedApps(cached_current_connected_apps); // ! MUST CHECK THEN UPDATE
            }
        })();
    }, [password, storage, private_keys, current_chain_network, current_connected_apps]);

    // update on this hook
    // const updatePasswordHashed = useCallback(
    //     async (password_hashed: string) => {
    //         await storage.set(LOCAL_SECURE_KEY_PRIVATE_KEYS, password_hashed);
    //         cached_password_hashed = password_hashed;
    //         setPasswordHashed(password_hashed);
    //     },
    //     [storage],
    // );
    const pushOrUpdateConnectedApp = useCallback(
        async (chain: Chain, app: ConnectedApp) => {
            if (!password || !storage) return;
            if (!private_keys) return;
            if (!current_chain_network) return;
            if (!current_connected_apps) return;
            const new_current_connected_apps = await push_or_update_connected_app(
                chain,
                app,
                storage,
                private_keys,
                current_chain_network,
                current_connected_apps,
            );
            if (!same(new_current_connected_apps, current_connected_apps)) {
                setCurrentConnectedApps(new_current_connected_apps);
            }
        },
        [password, storage, private_keys, current_chain_network, current_connected_apps],
    );

    // current address
    const [current_address, setCurrentAddress] = useState<IdentityAddress>();
    useEffect(() => {
        if (!private_keys) return setCurrentAddress(undefined);
        if (!current_chain_network) return setCurrentAddress(undefined);
        const current = private_keys.keys.find((i) => i.id === private_keys.current);
        if (!current) return setCurrentAddress(undefined);
        const current_address = inner_get_current_address(current);

        // ! refresh agent
        agent_refresh_unique_identity(private_keys, current_chain_network); // * refresh identity

        return setCurrentAddress(current_address);
    }, [private_keys, current_chain_network]);

    return {
        // private_keys,
        chain_networks,
        current_chain_network,
        current_connected_apps,
        current_address,
        current_identity: private_keys?.current,
        pushOrUpdateConnectedApp,
    };
};

export const inner_get_current_address = (current: IdentityKey) => {
    const current_address = match_combined_identity_key(current.key, {
        mnemonic: (mnemonic) => get_address_by_mnemonic(mnemonic.mnemonic),
        private_key: () => {
            throw new Error(`Unimplemented identity type: private_key`);
        },
    });
    return current_address;
};

const push_or_update_connected_app = async (
    chain: Chain,
    app: ConnectedApp,
    storage: SecureStorage,
    private_keys: PrivateKeys,
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
            const key_ic = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(private_keys.current, current_chain_network.ic);
            await storage.set(key_ic, apps);
            const new_current_connected_apps: CurrentConnectedApps = { ...current_connected_apps, ic: apps };
            return new_current_connected_apps;
        },
    });
};
