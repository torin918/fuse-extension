import type { IdentityId } from '~types/identity';
import { get_chain_network_key, type ChainNetwork } from '~types/network';

// prefix
const SYNC_KEY_PREFIX = ':fuse';
const LOCAL_KEY_PREFIX = ':fuse';
const SESSION_KEY_PREFIX = ':fuse';

// ############### SYNC ###############

// user settings
const SYNC_KEY_PREFIX_USER_SETTINGS = `${SYNC_KEY_PREFIX}:user:settings`;
export const SYNC_KEY_USER_SETTINGS_IDLE = `${SYNC_KEY_PREFIX_USER_SETTINGS}:idle`; // * sync

// ############### LOCAL ###############

export const LOCAL_KEY_WELCOMED = `${LOCAL_KEY_PREFIX}:welcomed`; // * local
export const LOCAL_KEY_PASSWORD_HASHED = `${LOCAL_KEY_PREFIX}:password_hashed`; // * local

const LOCAL_KEY_PREFIX_CACHED = `${LOCAL_KEY_PREFIX}:cached`;
export const LOCAL_KEY_CACHED_KEY = (key: string) => `${LOCAL_KEY_PREFIX_CACHED}:${key}`; // * local

const LOCAL_KEY_PREFIX_TOKEN = `${LOCAL_KEY_PREFIX}:token`;
export const LOCAL_KEY_TOKEN_INFO_IC = `${LOCAL_KEY_PREFIX_TOKEN}:info:ic`; // * local
export const LOCAL_KEY_TOKEN_INFO_IC_UPDATED = `${LOCAL_KEY_PREFIX_TOKEN}:info:ic:updated`; // * local
export const LOCAL_KEY_TOKEN_BALANCE_IC = (principal: string) => `${LOCAL_KEY_PREFIX_TOKEN}:balance:ic:${principal}`; // * local

// ############### SESSION ###############

export const SESSION_KEY_PASSWORD = `${SESSION_KEY_PREFIX}:password`; // * session
export const SESSION_KEY_PASSWORD_ALIVE = `${SESSION_KEY_PREFIX}:password:alive`; // * session
export const SESSION_KEY_RESTORE = `${SESSION_KEY_PREFIX}:restore`; // * session
export const SESSION_KEY_POPUP_ACTIONS = `${SESSION_KEY_PREFIX}:popup:actions`; // * session
export const SESSION_KEY_PATHNAME = `${SESSION_KEY_PREFIX}:pathname`; // * session

// session
export const SESSION_KEY_CURRENT_SESSION_CONNECTED_APP = (id: IdentityId, network: ChainNetwork, origin: string) =>
    `${SESSION_KEY_PREFIX}:${id}:${get_chain_network_key(network)}:app:${origin}:connected`; // * session // mark current connected

// temp
export const SESSION_KEY_CURRENT_SESSION_CONNECTED_APP_MESSAGE = (
    id: IdentityId,
    network: ChainNetwork,
    origin: string,
    message_id: string,
) => `${SESSION_KEY_PREFIX}:${id}:${get_chain_network_key(network)}:app:${origin}:message:${message_id}:connected`; // * session // mark once // temp
export const SESSION_KEY_CURRENT_SESSION_APPROVE = (
    id: IdentityId,
    network: ChainNetwork,
    origin: string,
    approve_id: string,
) => `${SESSION_KEY_PREFIX}:${id}:${get_chain_network_key(network)}:app:${origin}:approve:${approve_id}`; // * session // make once approve // temp
