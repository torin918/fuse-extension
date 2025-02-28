import type { IdentityId } from '~types/identity';
import { get_chain_network_key, type ChainNetwork } from '~types/network';

// prefix
const SYNC_KEY_PREFIX = ':fuse';
const LOCAL_SECURE_KEY_PREFIX = ':fuse:secure';
const LOCAL_KEY_PREFIX = ':fuse';
const SESSION_KEY_PREFIX = ':fuse';

// ############### SYNC ###############

// user settings
const SYNC_KEY_PREFIX_USER_SETTINGS = `${SYNC_KEY_PREFIX}:user:settings`;
export const SYNC_KEY_USER_SETTINGS_IDLE = `${SYNC_KEY_PREFIX_USER_SETTINGS}:idle`; // * sync

// ############### LOCAL SECURE ###############

export const LOCAL_SECURE_KEY_PRIVATE_KEYS = `${LOCAL_SECURE_KEY_PREFIX}:private_keys`; // * local secure
export const LOCAL_SECURE_KEY_CHAIN_NETWORKS = `${LOCAL_SECURE_KEY_PREFIX}:chain:networks`; // * local secure
export const LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK = (id: IdentityId) =>
    `${LOCAL_SECURE_KEY_PREFIX}:${id}:chain:network`; // * local secure
export const LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS = (id: IdentityId, network: ChainNetwork) =>
    `${LOCAL_SECURE_KEY_PREFIX}:${id}:${get_chain_network_key(network)}:connected:apps`; // * local secure

// ############### LOCAL ###############

export const LOCAL_KEY_WELCOMED = `${LOCAL_KEY_PREFIX}:welcomed`; // * local
export const LOCAL_KEY_PASSWORD_HASHED = `${LOCAL_KEY_PREFIX}:password_hashed`; // * local

const LOCAL_KEY_PREFIX_CACHED = `${LOCAL_KEY_PREFIX}:cached`;
export const LOCAL_KEY_CACHED_KEY = (key: string) => `${LOCAL_KEY_PREFIX_CACHED}:${key}`; // * local

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
