import { useMemo } from 'react';

import { agent_refresh_unique_identity } from '~hooks/store/agent';
import { get_address_by_mnemonic } from '~lib/mnemonic';
import { match_combined_identity_key, type IdentityAddress, type IdentityKey, type PrivateKeys } from '~types/identity';
import type { CurrentChainNetwork } from '~types/network';

export const useCurrentAddressBy = (
    private_keys: PrivateKeys | undefined,
    current_chain_network: CurrentChainNetwork,
): IdentityAddress | undefined => {
    const current_address = useMemo<IdentityAddress | undefined>(() => {
        if (!private_keys || !current_chain_network) return undefined;
        const current = private_keys.keys.find((i) => i.id === private_keys.current);
        if (!current) return undefined;
        const current_address = inner_get_current_address(current);

        // ! refresh agent
        agent_refresh_unique_identity(private_keys, current_chain_network); // * refresh identity

        return current_address;
    }, [private_keys, current_chain_network]);

    return current_address;
};

export const inner_get_current_address = (current: IdentityKey) => {
    const current_address = match_combined_identity_key(current.key, {
        mnemonic: (mnemonic) => get_address_by_mnemonic(mnemonic.mnemonic, mnemonic.subaccount, mnemonic.parsed),
        private_key: () => {
            throw new Error(`Unimplemented identity type: private_key`);
        },
    });
    return current_address;
};
