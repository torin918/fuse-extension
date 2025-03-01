import type { IdentityId } from '~types/identity';
import { get_chain_network_key, type ChainNetwork } from '~types/network';

const LOCAL_SECURE_KEY_PREFIX = ':fuse:secure';

// ############### LOCAL SECURE ###############

export const LOCAL_SECURE_KEY_PRIVATE_KEYS = `${LOCAL_SECURE_KEY_PREFIX}:private_keys`; // * local secure
export const LOCAL_SECURE_KEY_CHAIN_NETWORKS = `${LOCAL_SECURE_KEY_PREFIX}:chain:networks`; // * local secure
export const LOCAL_SECURE_KEY_CURRENT_CHAIN_NETWORK = (id: IdentityId) =>
    `${LOCAL_SECURE_KEY_PREFIX}:${id}:chain:network`; // * local secure
export const LOCAL_SECURE_KEY_CURRENT_CONNECTED_APPS = (id: IdentityId, network: ChainNetwork) =>
    `${LOCAL_SECURE_KEY_PREFIX}:${id}:${get_chain_network_key(network)}:connected:apps`; // * local secure

export const LOCAL_SECURE_KEY_RECENT_ADDRESSES = `${LOCAL_SECURE_KEY_PREFIX}:recent:addresses`; // * local secure
export const LOCAL_SECURE_KEY_MARKED_ADDRESSES = `${LOCAL_SECURE_KEY_PREFIX}:marked:addresses`; // * local secure
