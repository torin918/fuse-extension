import { useMemo } from 'react';

import { simple_identity_key, type IdentityId, type PrivateKeys, type SimpleIdentityKey } from '~types/identity';

export const useIdentityListBy = (
    private_keys: PrivateKeys | undefined,
    setPrivateKeys: (value: PrivateKeys) => Promise<void>,
): {
    current_identity: IdentityId | undefined;
    identity_list: SimpleIdentityKey[] | undefined;
} => {
    const current_identity = useMemo(() => private_keys?.current, [private_keys]);
    const identity_list = useMemo<SimpleIdentityKey[] | undefined>(() => {
        if (!private_keys) return undefined;
        return private_keys.keys.map(simple_identity_key);
    }, [private_keys]);

    return { current_identity, identity_list };
};
