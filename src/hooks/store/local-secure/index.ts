import { useCallback, useMemo } from 'react';

import { SecureStorage } from '@plasmohq/storage/secure';

import { check_password, hash_password, verify_password } from '~lib/password';
import type { ApprovedState } from '~types/actions/approve';
import { type Chain } from '~types/chain';
import { type ConnectedApps, type CurrentConnectedApps } from '~types/connect';
import type { CurrentInfo } from '~types/current';
import { type IdentityAddress, type IdentityKey, type KeyRings } from '~types/identity';
import {
    DEFAULT_CURRENT_CHAIN_NETWORK,
    type CurrentChainNetwork,
    type CurrentIdentityNetwork,
    type IdentityNetwork,
} from '~types/network';

import { agent_refresh_unique_identity } from '../agent';
import { identity_network_callback } from '../common';
import {
    LOCAL_SECURE_KEY_APPROVED,
    LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK,
    LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS,
    LOCAL_SECURE_KEY_KEY_RINGS,
    SESSION_KEY_UNLOCKED,
} from '../keys';
import { setPasswordHashedDirectly, usePasswordHashed } from '../local';
import {
    __get_actual_password,
    __get_password,
    __get_session_storage,
    refreshUnlockedDirectly,
    useUnlocked,
} from '../session';
import { useMarkedAddressesInner2 } from './address/marked_address';
import { useRecentAddressesInner2 } from './address/recent_address';
import { useCurrentChainNetworkInner } from './current/current_chain_network';
import { get_current_connected_apps, useCurrentConnectedAppsInner } from './current/current_connected_apps';
import { useKeyRingsInner } from './key_rings';
import { get_current_identity_network, useCurrentIdentityBy } from './memo/current';
import { useIdentityKeysBy, useIdentityKeysCountBy } from './memo/identity';
import { useSecureStorageInner } from './storage';

// ! Important data and do NEVER export
const LOCAL_SECURE_STORAGE = () => new SecureStorage({ area: 'local' }); // local secure
const SESSION_STORAGE = __get_session_storage();

// ############### LOCAL SECURE ###############

const useSecureStorageBy = (unlocked: string) => useSecureStorageInner(unlocked, LOCAL_SECURE_STORAGE);

export const useChangePassword = () => {
    const [password_hashed] = usePasswordHashed();
    const changePassword = useCallback(
        async (old_password: string, new_password: string): Promise<boolean | undefined> => {
            const checked = await verify_password(password_hashed, old_password);
            if (!checked) return false;
            if (!check_password(new_password)) return false;

            const new_password_hashed = await hash_password(new_password);

            const old_storage = LOCAL_SECURE_STORAGE();
            const { actual_password: old_actual_password } = await __get_actual_password(old_password);
            await old_storage.setPassword(old_actual_password);
            const new_storage = LOCAL_SECURE_STORAGE();
            const { unlocked, actual_password: new_actual_password } = await __get_actual_password(new_password);
            await new_storage.setPassword(new_actual_password);

            // console.error('before migrate');
            // console.error('old storage', await old_storage.getAll());
            // console.error('new storage', await new_storage.getAll());

            // await old_storage.migrate(new_storage); // ! failed
            const keys = Object.keys(await old_storage.getAll()); // get all keys
            const data = await old_storage.getMany(keys); // get all data
            await new_storage.setMany(data); // set new data
            await old_storage.removeMany(keys); // remove old data

            await setPasswordHashedDirectly(new_password_hashed);
            await refreshUnlockedDirectly(unlocked);
            return true;
        },
        [password_hashed],
    );
    return changePassword;
};

export const useCurrentConnectedApps = () => {
    const [unlocked] = useUnlocked();
    const storage = useSecureStorageBy(unlocked);
    const [key_rings] = useKeyRingsInner(storage);
    const [current_chain_network] = useCurrentChainNetworkInner(storage, key_rings?.current);
    const current_identity_network: CurrentIdentityNetwork | undefined = useMemo(() => {
        if (!key_rings) return undefined;
        const current = key_rings.keys.find((i) => i.id === key_rings.current);
        if (!current) return undefined;
        const address = current.address;
        return {
            ic: address.ic ? { chain: 'ic', owner: address.ic.owner, network: current_chain_network.ic } : undefined,
        };
    }, [key_rings, current_chain_network]);
    return useCurrentConnectedAppsInner(storage, current_identity_network);
};

export const useCurrentIdentity = () => {
    const [unlocked] = useUnlocked();
    const storage = useSecureStorageBy(unlocked);
    const [key_rings] = useKeyRingsInner(storage);
    const [current_chain_network] = useCurrentChainNetworkInner(storage, key_rings?.current);
    return useCurrentIdentityBy(key_rings, current_chain_network);
};

export const useIdentityKeysCount = () => {
    const [unlocked] = useUnlocked();
    const storage = useSecureStorageBy(unlocked);
    const [key_rings] = useKeyRingsInner(storage);
    return useIdentityKeysCountBy(key_rings);
};
export const useIdentityKeys = () => {
    const [password_hashed] = usePasswordHashed();
    const [unlocked] = useUnlocked();
    const storage = useSecureStorageBy(unlocked);
    const [key_rings, setKeyRings] = useKeyRingsInner(storage);
    return useIdentityKeysBy(password_hashed, key_rings, setKeyRings);
};

export const useRecentAddresses = () => {
    const [unlocked] = useUnlocked();
    const storage = useSecureStorageBy(unlocked);
    return useRecentAddressesInner2(storage);
};
export const useMarkedAddresses = () => {
    const [unlocked] = useUnlocked();
    const storage = useSecureStorageBy(unlocked);
    return useMarkedAddressesInner2(storage);
};
// ================ set directly by storage ================

// ############### LOCAL SECURE ###############

export const setKeyRingsDirectly = async (actual_password: string, key_rings: KeyRings) => {
    const storage = LOCAL_SECURE_STORAGE();
    await storage.setPassword(actual_password); // set password before any action

    await storage.set(LOCAL_SECURE_KEY_KEY_RINGS, key_rings);
};

const get_unlocked_secure_storage = async () => {
    const unlocked = await SESSION_STORAGE.get<string>(SESSION_KEY_UNLOCKED);
    if (!unlocked) return; // locked

    const storage = LOCAL_SECURE_STORAGE();
    await storage.setPassword(__get_password(unlocked)); // set password before any action

    return storage;
};

// identity address
const _inner_get_current_address = async (): Promise<
    { current_address: IdentityAddress; storage: SecureStorage; key_rings: KeyRings; current: IdentityKey } | undefined
> => {
    const storage = await get_unlocked_secure_storage();
    if (!storage) return undefined; // get secure storage after password

    const key_rings = await storage.get<KeyRings>(LOCAL_SECURE_KEY_KEY_RINGS);
    // const chain_networks = await LOCAL_SECURE_STORAGE.get<ChainNetworks>(KEY_CHAIN_NETWORKS);
    if (key_rings === undefined) throw new Error('no private keys');

    const current = key_rings.keys.find((i) => i.id === key_rings.current);
    if (!current) throw new Error('can not find current identity');

    const current_address = current.address;

    return { current_address, storage, key_rings, current };
};
export const get_current_identity_address = async (): Promise<IdentityAddress | undefined> => {
    return (await _inner_get_current_address())?.current_address;
};

// current info
export const get_current_info = async (): Promise<CurrentInfo | undefined> => {
    const _r = await _inner_get_current_address();
    if (!_r) return undefined;

    const { current_address, storage, key_rings, current } = _r;

    const current_chain_network =
        (await storage.get<CurrentChainNetwork>(LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(key_rings.current))) ??
        DEFAULT_CURRENT_CHAIN_NETWORK;

    agent_refresh_unique_identity(current, current_chain_network); // * refresh identity

    const current_identity_network: CurrentIdentityNetwork = get_current_identity_network(
        current_address,
        current_chain_network,
    );

    const current_connected_apps: CurrentConnectedApps = await get_current_connected_apps(
        storage,
        current_identity_network,
    );

    return {
        current_identity: key_rings.current,
        current_chain_network,
        current_identity_network,
        current_connected_apps,
    };
};

// update connected apps
export const set_current_connected_apps = async (
    chain: Chain,
    current_identity_network: CurrentIdentityNetwork,
    apps: ConnectedApps,
): Promise<void> => {
    const storage = await get_unlocked_secure_storage();
    if (!storage) return undefined; // get secure storage after password

    const identity_network = await identity_network_callback<IdentityNetwork | undefined>(
        chain,
        current_identity_network,
        undefined,
        async (s) => s,
    );
    if (!identity_network) return;

    const key = LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(identity_network);
    await storage.set(key, apps);
};

// marked granted/denied local
export const find_local_secure_approved = async (
    chain: Chain,
    current_identity_network: CurrentIdentityNetwork,
    origin: string,
    request_hash: string,
): Promise<ApprovedState | undefined> => {
    const storage = await get_unlocked_secure_storage();
    if (!storage) return undefined; // get secure storage after password
    return identity_network_callback(chain, current_identity_network, undefined, async (identity_network) => {
        const key = LOCAL_SECURE_KEY_APPROVED(identity_network, origin, request_hash);
        return await storage.get<ApprovedState>(key);
    });
};
export const delete_local_secure_approved = async (
    chain: Chain,
    current_identity_network: CurrentIdentityNetwork,
    origin: string,
    request_hash: string,
): Promise<void> => {
    const storage = await get_unlocked_secure_storage();
    if (!storage) return undefined; // get secure storage after password
    return identity_network_callback(chain, current_identity_network, undefined, async (identity_network) => {
        const key = LOCAL_SECURE_KEY_APPROVED(identity_network, origin, request_hash);
        await storage.remove(key);
    });
};
export const set_local_secure_approved = async (
    chain: Chain,
    current_identity_network: CurrentIdentityNetwork,
    origin: string,
    request_hash: string,
    state: ApprovedState,
): Promise<void> => {
    const storage = await get_unlocked_secure_storage();
    if (!storage) return undefined; // get secure storage after password
    return identity_network_callback(chain, current_identity_network, undefined, async (identity_network) => {
        const key = LOCAL_SECURE_KEY_APPROVED(identity_network, origin, request_hash);
        await storage.set(key, state);
    });
};
