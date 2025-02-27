import { Storage } from '@plasmohq/storage';
import { SecureStorage } from '@plasmohq/storage/secure';

import { is_same_popup_action, type PopupAction, type PopupActions } from '~types/actions';
import { match_chain_async, type Chain } from '~types/chain';
import type { ConnectedApps, CurrentConnectedApps } from '~types/connect';
import type { CurrentInfo } from '~types/current';
import type { IdentityAddress, IdentityId, PrivateKeys } from '~types/identity';
import { DEFAULT_CURRENT_CHAIN_NETWORK, type CurrentChainNetwork } from '~types/network';

import { agent_refresh_unique_identity } from './agent';
import {
    LOCAL_KEY_CACHED_KEY,
    LOCAL_KEY_PASSWORD_HASHED,
    LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK,
    LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS,
    LOCAL_SECURE_KEY_PRIVATE_KEYS,
    SESSION_KEY_CURRENT_SESSION_APPROVE,
    SESSION_KEY_CURRENT_SESSION_CONNECTED_APP,
    SESSION_KEY_CURRENT_SESSION_CONNECTED_APP_MESSAGE,
    SESSION_KEY_PASSWORD,
    SESSION_KEY_PASSWORD_ALIVE,
    SESSION_KEY_POPUP_ACTIONS,
} from './keys';
import { inner_get_current_address, useSecuredDataInner } from './local-secure';
import { usePasswordHashedInner } from './local/password_hashed';
import { useWelcomedInner } from './local/welcome';
import { usePasswordInner } from './session/password';
import { usePasswordAliveInner } from './session/password_alive';
import { usePopupActionsInner } from './session/popup_actions';
import { useRestoreInner } from './session/restore';
import { useUserSettingsIdleInner } from './sync/user/settings/idle';

// * sync -> sync by google account -> user custom settings
const STORAGE = new Storage(); // sync
// const secure_storage = new SecureStorage(); // sync
// * local -> current browser
const LOCAL_STORAGE = new Storage({ area: 'local' }); // local
const LOCAL_SECURE_STORAGE = new SecureStorage({ area: 'local' }); // local
// * session -> current session
const SESSION_STORAGE = new Storage({ area: 'session' }); // session
// const session_secure_storage = new SecureStorage({ area: 'session' }); // session

// ================ hooks ================

// ############### SYNC ###############

// use settings
export const useUserSettingsIdle = () => useUserSettingsIdleInner(STORAGE); // sync

// ############### LOCAL SECURE ###############
export const useSecuredData = () => useSecuredDataInner(LOCAL_SECURE_STORAGE); // local secure

// ############### LOCAL ###############
export const useWelcomed = () => useWelcomedInner(LOCAL_STORAGE); // local
export const usePasswordHashed = () => usePasswordHashedInner(LOCAL_STORAGE); // local

// ############### SESSION ###############
export const usePassword = () => usePasswordInner(SESSION_STORAGE); // session
export const usePasswordAlive = () => usePasswordAliveInner(SESSION_STORAGE); // session
export const useRestore = () => useRestoreInner(SESSION_STORAGE); // session
export const usePopupActions = () => usePopupActionsInner(SESSION_STORAGE); // session

// ================ set directly by storage ================

// ############### LOCAL SECURE ###############

export const setPrivateKeysDirectly = async (password: string, private_keys: PrivateKeys) => {
    await LOCAL_SECURE_STORAGE.setPassword(password);
    await LOCAL_SECURE_STORAGE.set(LOCAL_SECURE_KEY_PRIVATE_KEYS, private_keys);
};

// identity address
export const get_current_identity_address = async (): Promise<IdentityAddress | undefined> => {
    const password = await SESSION_STORAGE.get<string>(SESSION_KEY_PASSWORD);
    if (!password) return undefined; // locked

    await LOCAL_SECURE_STORAGE.setPassword(password); // set password before any action

    const private_keys = await LOCAL_SECURE_STORAGE.get<PrivateKeys>(LOCAL_SECURE_KEY_PRIVATE_KEYS);
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

    await LOCAL_SECURE_STORAGE.setPassword(password); // set password before any action

    const private_keys = await LOCAL_SECURE_STORAGE.get<PrivateKeys>(LOCAL_SECURE_KEY_PRIVATE_KEYS);
    // const chain_networks = await local_secure_storage.get<ChainNetworks>(KEY_CHAIN_NETWORKS);
    if (private_keys === undefined) throw new Error('no private keys');

    const current_chain_network =
        (await LOCAL_SECURE_STORAGE.get<CurrentChainNetwork>(
            LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK(private_keys.current),
        )) ?? DEFAULT_CURRENT_CHAIN_NETWORK;

    agent_refresh_unique_identity(private_keys, current_chain_network); // * refresh identity

    const current_connected_apps: CurrentConnectedApps = {
        ic:
            (await LOCAL_SECURE_STORAGE.get<ConnectedApps>(
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

    await LOCAL_SECURE_STORAGE.setPassword(password); // set password before any action

    match_chain_async(chain, {
        ic: async () => {
            await LOCAL_SECURE_STORAGE.set(
                LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS(current_identity, current_chain_network.ic),
                apps,
            );
        },
    });
};

// ############### LOCAL ###############

export const setPasswordHashedDirectly = async (password_hashed: string) => {
    await LOCAL_STORAGE.set(LOCAL_KEY_PASSWORD_HASHED, password_hashed);
};

// current status
export const is_current_initial = async (): Promise<boolean> => {
    const password_hashed = await LOCAL_STORAGE.get<string>(LOCAL_KEY_PASSWORD_HASHED);
    return !!password_hashed;
};

// cached data
export const get_cached_data = async (
    key: string,
    produce: () => Promise<string>,
    alive = 86400000,
): Promise<string> => {
    const cache_key = LOCAL_KEY_CACHED_KEY(key);
    let cached = await LOCAL_STORAGE.get<{
        value: string;
        created: number;
    }>(cache_key);
    const now = Date.now();
    if (!cached || cached.created + alive < now) {
        const value = await produce();
        cached = { value, created: now };
        await LOCAL_STORAGE.set(cache_key, cached);
    }
    return cached.value;
};

// ############### SESSION ###############

// password
export const setPasswordAliveDirectly = async (password_alive = Date.now()) => {
    await SESSION_STORAGE.set(SESSION_KEY_PASSWORD_ALIVE, password_alive);
};
export const setPasswordDirectly = async (password: string) => {
    await SESSION_STORAGE.set(SESSION_KEY_PASSWORD, password);
};
export const refreshPasswordDirectly = async (password: string) => {
    await setPasswordAliveDirectly(); // must before set password
    await setPasswordDirectly(password);
};
export const lockDirectly = async () => {
    await setPasswordDirectly(''); // remove password
    await setPasswordAliveDirectly(0);
};

// current status
export const is_current_locked = async (): Promise<boolean> => {
    const password = await SESSION_STORAGE.get<string>(SESSION_KEY_PASSWORD);
    return !password;
};

// temp connected app message
export const find_current_session_connected_app_message = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
    message_id: string,
): Promise<boolean | undefined> => {
    return match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_CONNECTED_APP_MESSAGE(
                current_identity,
                current_chain_network.ic,
                origin,
                message_id,
            );
            return await SESSION_STORAGE.get<boolean>(key);
        },
    });
};
export const delete_current_session_connected_app_message = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
    message_id: string,
): Promise<void> => {
    match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_CONNECTED_APP_MESSAGE(
                current_identity,
                current_chain_network.ic,
                origin,
                message_id,
            );
            await SESSION_STORAGE.remove(key);
        },
    });
};
export const set_current_session_connected_app_message = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
    message_id: string,
    granted: boolean,
): Promise<void> => {
    match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_CONNECTED_APP_MESSAGE(
                current_identity,
                current_chain_network.ic,
                origin,
                message_id,
            );
            await SESSION_STORAGE.set(key, granted);
        },
    });
};

// temp session app
export const query_current_session_connected_app = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
): Promise<boolean> => {
    return match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_CONNECTED_APP(current_identity, current_chain_network.ic, origin);
            return !!(await SESSION_STORAGE.get<boolean>(key));
        },
    });
};
export const grant_current_session_connected_app = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
) => {
    match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_CONNECTED_APP(current_identity, current_chain_network.ic, origin);
            await SESSION_STORAGE.set(key, true);
        },
    });
};
export const revoke_current_session_connected_app = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
) => {
    match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_CONNECTED_APP(current_identity, current_chain_network.ic, origin);
            await SESSION_STORAGE.remove(key);
        },
    });
};
export const reset_current_session_connected_app = async (
    current_info: CurrentInfo,
    chain: Chain,
    origin: string,
    granted: boolean,
) => {
    if (granted) {
        await grant_current_session_connected_app(
            current_info.current_identity,
            current_info.current_chain_network,
            chain,
            origin,
        );
    } else {
        await revoke_current_session_connected_app(
            current_info.current_identity,
            current_info.current_chain_network,
            chain,
            origin,
        );
    }
};

// temp approve action
export const find_current_session_approve = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
    approve_id: string,
): Promise<boolean | undefined> => {
    return match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_APPROVE(
                current_identity,
                current_chain_network.ic,
                origin,
                approve_id,
            );
            return await SESSION_STORAGE.get<boolean>(key);
        },
    });
};
export const delete_current_session_approve = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
    approve_id: string,
): Promise<void> => {
    match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_APPROVE(
                current_identity,
                current_chain_network.ic,
                origin,
                approve_id,
            );
            await SESSION_STORAGE.remove(key);
        },
    });
};
export const set_current_session_approve = async (
    current_identity: IdentityId,
    current_chain_network: CurrentChainNetwork,
    chain: Chain,
    origin: string,
    approve_id: string,
    approved: boolean,
): Promise<void> => {
    match_chain_async(chain, {
        ic: async () => {
            const key = SESSION_KEY_CURRENT_SESSION_APPROVE(
                current_identity,
                current_chain_network.ic,
                origin,
                approve_id,
            );
            await SESSION_STORAGE.set(key, approved);
        },
    });
};

// temp popup actions
export const get_popup_actions = async (): Promise<PopupActions> => {
    return (await SESSION_STORAGE.get<PopupActions>(SESSION_KEY_POPUP_ACTIONS)) ?? [];
};
export const delete_all_popup_actions = async (): Promise<PopupActions> => {
    const actions = await get_popup_actions();
    await SESSION_STORAGE.remove(SESSION_KEY_POPUP_ACTIONS);
    return actions;
};
export const delete_popup_action = async (action: PopupAction): Promise<void> => {
    let actions = await get_popup_actions();
    const a = actions.find((a) => is_same_popup_action(a, action));
    if (a === undefined) return;
    actions = actions.filter((a) => !is_same_popup_action(a, action));
    if (actions.length) await SESSION_STORAGE.set(SESSION_KEY_POPUP_ACTIONS, actions);
    else await SESSION_STORAGE.remove(SESSION_KEY_POPUP_ACTIONS);
};
export const push_popup_action = async (action: PopupAction): Promise<void> => {
    const actions = await get_popup_actions();
    const a = actions.find((a) => is_same_popup_action(a, action));
    if (a !== undefined) return; // already exists
    actions.push(action);
    await SESSION_STORAGE.set(SESSION_KEY_POPUP_ACTIONS, actions);
};
