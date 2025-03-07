import { useMemo } from 'react';

import { agent_refresh_unique_identity } from '~hooks/store/agent';
import { type PrivateKeys, type ShowIdentityKey } from '~types/identity';
import type { CurrentChainNetwork } from '~types/network';

import { inner_show_identity_key } from './identity';

export const useCurrentIdentityBy = (
    private_keys: PrivateKeys | undefined,
    current_chain_network: CurrentChainNetwork,
): ShowIdentityKey | undefined => {
    const current_identity = useMemo<ShowIdentityKey | undefined>(() => {
        if (!private_keys || !current_chain_network) return undefined;
        const current = private_keys.keys.find((i) => i.id === private_keys.current);
        if (!current) return undefined;

        // ! refresh agent
        agent_refresh_unique_identity(current, current_chain_network); // * refresh identity

        return inner_show_identity_key(private_keys, current);
    }, [private_keys, current_chain_network]);

    return current_identity;
};
