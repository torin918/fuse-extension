import { Storage } from '@plasmohq/storage';

import { is_same_popup_action, type PopupAction, type PopupActions } from '~types/actions';
import { match_chain_async, type Chain } from '~types/chain';
import type { CurrentInfo } from '~types/current';
import type { IdentityId } from '~types/identity';
import { type CurrentChainNetwork } from '~types/network';

import {
    LOCAL_KEY_CACHED_KEY,
    LOCAL_KEY_PASSWORD_HASHED,
    SESSION_KEY_CURRENT_SESSION_APPROVE,
    SESSION_KEY_CURRENT_SESSION_CONNECTED_APP,
    SESSION_KEY_CURRENT_SESSION_CONNECTED_APP_MESSAGE,
    SESSION_KEY_PASSWORD,
    SESSION_KEY_PASSWORD_ALIVE,
    SESSION_KEY_POPUP_ACTIONS,
} from './keys';
import { usePasswordHashedInner } from './local/password_hashed';
import { useTokenInfoCurrentInner2 } from './local/token/current';
import { useTokenInfoCustomInner2 } from './local/token/custom';
import { useTokenBalanceIcByRefreshingInner } from './local/token/ic/balance';
import { useTokenInfoIcByInitialInner, useTokenInfoIcByRefreshingInner } from './local/token/ic/info';
import { useWelcomedInner } from './local/welcome';
import { usePasswordInner } from './session/password';
import { usePasswordAliveInner } from './session/password_alive';
import { usePathnameInner } from './session/pathname';
import { usePopupActionsInner } from './session/popup_actions';
import { useRestoreInner } from './session/restore';
import { useUserSettingsIdleInner } from './sync/user/settings/idle';

// * sync -> sync by google account -> user custom settings
const STORAGE = new Storage(); // sync
// const secure_storage = new SecureStorage(); // sync
// * local -> current browser
const LOCAL_STORAGE = new Storage({ area: 'local' }); // local
// const LOCAL_SECURE_STORAGE = new SecureStorage({ area: 'local' }); // local
// * session -> current session
const SESSION_STORAGE = new Storage({ area: 'session' }); // session
// const session_secure_storage = new SecureStorage({ area: 'session' }); // session
export const __get_session_storage = () => SESSION_STORAGE;

// ================ hooks ================

// ############### SYNC ###############

// use settings
export const useUserSettingsIdle = () => useUserSettingsIdleInner(STORAGE); // sync

// ############### LOCAL ###############
export const useWelcomed = () => useWelcomedInner(LOCAL_STORAGE); // local
export const usePasswordHashed = () => usePasswordHashedInner(LOCAL_STORAGE); // local
export const useTokenInfoIcByInitial = (canister_id: string) =>
    useTokenInfoIcByInitialInner(LOCAL_STORAGE, canister_id); // local
export const useTokenInfoIcByRefreshing = (sleep: number) => useTokenInfoIcByRefreshingInner(LOCAL_STORAGE, sleep); // local
export const useTokenBalanceIcByRefreshing = (principal: string | undefined, canister_id: string) =>
    useTokenBalanceIcByRefreshingInner(LOCAL_STORAGE, principal, canister_id); // local
export const useTokenInfoCustom = () => useTokenInfoCustomInner2(LOCAL_STORAGE); // local
export const useTokenInfoCurrent = () => useTokenInfoCurrentInner2(LOCAL_STORAGE); // local

// ############### SESSION ###############
export const usePassword = () => usePasswordInner(SESSION_STORAGE); // session
export const usePasswordAlive = () => usePasswordAliveInner(SESSION_STORAGE); // session
export const useRestore = () => useRestoreInner(SESSION_STORAGE); // session
export const usePopupActions = () => usePopupActionsInner(SESSION_STORAGE); // session
export const usePathname = () => usePathnameInner(SESSION_STORAGE); // session

// ================ set directly by storage ================

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
    produce: () => Promise<string | undefined>,
    alive = 86400000,
): Promise<string | undefined> => {
    const cache_key = LOCAL_KEY_CACHED_KEY(key);
    let cached = await LOCAL_STORAGE.get<{
        value: string;
        created: number;
    }>(cache_key);
    const now = Date.now();
    if (!cached || cached.created + alive < now) {
        const value = await produce();
        if (value === undefined) return undefined;
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
