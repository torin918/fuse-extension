import { useMemo } from 'react';

import { agent_refresh_unique_identity } from '~hooks/store/agent';
import { type PrivateKeys, type ShowIdentityKey } from '~types/identity';
import type { CurrentChainNetwork, CurrentIdentityNetwork } from '~types/network';

import { inner_show_identity_key } from './identity';

export const useCurrentIdentityBy = (
    private_keys: PrivateKeys | undefined,
    current_chain_network: CurrentChainNetwork,
): { current_identity: ShowIdentityKey | undefined; current_identity_network: CurrentIdentityNetwork | undefined } => {
    const current = useMemo<{
        current_identity: ShowIdentityKey | undefined;
        current_identity_network: CurrentIdentityNetwork | undefined;
    }>(() => {
        if (!private_keys || !current_chain_network)
            return { current_identity: undefined, current_identity_network: undefined };
        const current = private_keys.keys.find((i) => i.id === private_keys.current);
        if (!current) return { current_identity: undefined, current_identity_network: undefined };

        // ! refresh agent
        agent_refresh_unique_identity(current, current_chain_network); // * refresh identity

        const address = current.address;
        return {
            current_identity: inner_show_identity_key(private_keys, current),
            current_identity_network: {
                ic: address.ic
                    ? { chain: 'ic', owner: address.ic.owner, network: current_chain_network.ic }
                    : undefined,
            },
        };
    }, [private_keys, current_chain_network]);

    return current;
};
