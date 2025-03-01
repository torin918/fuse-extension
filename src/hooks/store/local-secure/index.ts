import { useCallback } from 'react';

import { SecureStorage } from '@plasmohq/storage/secure';

import { check_password, hash_password, verify_password } from '~lib/password';
import { match_chain_async, type Chain } from '~types/chain';
import { type ConnectedApps, type CurrentConnectedApps } from '~types/connect';
import type { CurrentInfo } from '~types/current';
import { type IdentityAddress, type IdentityId, type PrivateKeys } from '~types/identity';
import { DEFAULT_CURRENT_CHAIN_NETWORK, type CurrentChainNetwork } from '~types/network';

import {
    __get_session_storage,
    lockDirectly,
    refreshPasswordDirectly,
    setPasswordHashedDirectly,
    usePassword,
    usePasswordHashed,
} from '..';
import { agent_refresh_unique_identity } from '../agent';
import {
    LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK,
    LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS,
    LOCAL_SECURE_KEY_PRIVATE_KEYS,
    SESSION_KEY_PASSWORD,
} from '../keys';
import { useCurrentChainNetworkInner } from './current_chain_network';
import { useCurrentConnectedAppsInner } from './current_connected_apps';
import { inner_get_current_address, useCurrentAddressBy } from './memo/current_address';
import { useIdentityKeysBy, useIdentityKeysCountBy } from './memo/identity';
import { usePrivateKeysInner } from './private_keys';
import { useSecureStorageInner } from './storage';

// ! Important data and do NEVER export
const LOCAL_SECURE_STORAGE = () => new SecureStorage({ area: 'local' }); // local secure
const SESSION_STORAGE = __get_session_storage();

// ############### LOCAL SECURE ###############

const useSecureStorageBy = (password: string) => useSecureStorageInner(password, LOCAL_SECURE_STORAGE);

export const useChangePassword = () => {
    const [password_hashed] = usePasswordHashed();
    const changePassword = useCallback(
        async (old_password: string, new_password: string): Promise<boolean | undefined> => {
            const checked = await verify_password(password_hashed, old_password);
            if (!checked) return false;
            if (!check_password(new_password)) return false;

            const new_password_hashed = await hash_password(new_password);

            const old_storage = LOCAL_SECURE_STORAGE();
            await old_storage.setPassword(old_password);
            const new_storage = LOCAL_SECURE_STORAGE();
            await new_storage.setPassword(new_password);

            console.error('before migrate');
            console.error('old storage', await old_storage.getAll());
            console.error('new storage', await new_storage.getAll());

            // await old_storage.migrate(new_storage); // ! failed
            const keys = Object.keys(await old_storage.getAll()); // get all keys
            const data = await old_storage.getMany(keys); // get all data
            await new_storage.setMany(data); // set new data
            await old_storage.removeMany(keys); // remove old data

            await setPasswordHashedDirectly(new_password_hashed);
            await refreshPasswordDirectly(new_password);
            await lockDirectly();
        },
        [password_hashed],
    );
    return changePassword;
};

export const useCurrentConnectedApps = () => {
    const [password] = usePassword();
    const storage = useSecureStorageBy(password);
    const [private_keys] = usePrivateKeysInner(storage);
    const [current_chain_network] = useCurrentChainNetworkInner(storage, private_keys?.current);
    return useCurrentConnectedAppsInner(storage, private_keys?.current, current_chain_network);
};

export const useCurrentAddress = () => {
    const [password] = usePassword();
    const storage = useSecureStorageBy(password);
    const [private_keys] = usePrivateKeysInner(storage);
    const [current_chain_network] = useCurrentChainNetworkInner(storage, private_keys?.current);
    return useCurrentAddressBy(private_keys, current_chain_network);
};

export const useIdentityKeysCount = () => {
    const [password] = usePassword();
    const storage = useSecureStorageBy(password);
    const [private_keys] = usePrivateKeysInner(storage);
    return useIdentityKeysCountBy(private_keys);
};
export const useIdentityKeys = () => {
    const [password_hashed] = usePasswordHashed();
    const [password] = usePassword();
    const storage = useSecureStorageBy(password);
    const [private_keys, setPrivateKeys] = usePrivateKeysInner(storage);
    return useIdentityKeysBy(password_hashed, private_keys, setPrivateKeys);
};

// ================ set directly by storage ================

// ############### LOCAL SECURE ###############

export const setPrivateKeysDirectly = async (password: string, private_keys: PrivateKeys) => {
    const storage = LOCAL_SECURE_STORAGE();
    await storage.setPassword(password);

    await storage.set(LOCAL_SECURE_KEY_PRIVATE_KEYS, private_keys);
};

// identity address
export const get_current_identity_address = async (): Promise<IdentityAddress | undefined> => {
    const password = await SESSION_STORAGE.get<string>(SESSION_KEY_PASSWORD);
    if (!password) return undefined; // locked

    const storage = LOCAL_SECURE_STORAGE();
    await storage.setPassword(password); // set password before any action

    const private_keys = await storage.get<PrivateKeys>(LOCAL_SECURE_KEY_PRIVATE_KEYS);
    // const chain_networks = await LOCAL_SECURE_STORAGE.get<ChainNetworks>(KEY_CHAIN_NETWORKS);
    if (private_keys === undefined) throw new Error('no private keys');

    const current = private_keys.keys.find((i) => i.id === private_keys.current);
    if (!current) throw new Error('can not find current identity');

    const current_address = inner_get_current_address(current);

    return current_address;
};

// current info
export const get_current_info = async (): Promise<CurrentInfo | undefined> => {
    const password = await SESSION_STORAGE.get<string>(SESSION_KEY_PASSWORD);
    if (!password) return undefined; // locked

    const storage = LOCAL_SECURE_STORAGE();
    await storage.setPassword(password); // set password before any action

    const private_keys = await storage.get<PrivateKeys>(LOCAL_SECURE_KEY_PRIVATE_KEYS);
    // const chain_networks = await local_secure_storage.get<ChainNetworks>(KEY_CHAIN_NETWORKS);
    if (private_keys === undefined) throw new Error('no private keys');

    const current_chain_network =
        (await storage.get<CurrentChainNetwork>(LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(private_keys.current))) ??
        DEFAULT_CURRENT_CHAIN_NETWORK;

    agent_refresh_unique_identity(private_keys, current_chain_network); // * refresh identity

    const current_connected_apps: CurrentConnectedApps = {
        ic:
            (await storage.get<ConnectedApps>(
                LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(private_keys.current, current_chain_network.ic),
            )) ?? [],
    };

    return { current_identity: private_keys.current, current_chain_network, current_connected_apps };
};

// update connected apps
export const set_current_connected_apps = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    apps: ConnectedApps,
): Promise<void> => {
    const password = await SESSION_STORAGE.get<string>(SESSION_KEY_PASSWORD);
    if (!password) return; // locked

    const storage = LOCAL_SECURE_STORAGE();
    await storage.setPassword(password); // set password before any action

    match_chain_async(chain, {
        ic: async () => {
            await storage.set(
                LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(current_identity, current_chain_network.ic),
                apps,
            );
        },
    });
};
