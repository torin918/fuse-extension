import { useEffect, useMemo, useState } from 'react';

import { same } from '~lib/utils/same';
import { type IdentityId, type IdentityKey, type PrivateKeys, type ShowIdentityKey } from '~types/identity';

import { inner_get_current_address } from './current_address';

export const useIdentityListBy = (
    private_keys: PrivateKeys | undefined,
    setPrivateKeys: (value: PrivateKeys) => Promise<void>,
): {
    current_identity: IdentityId | undefined;
    identity_list: ShowIdentityKey[] | undefined;
} => {
    const current_identity = useMemo(() => private_keys?.current, [private_keys]);

    // !React state update on a component that hasn't mounted
    // const identity_list = useMemo<ShowIdentityKey[] | undefined>(() => {
    //     if (!private_keys) return undefined;
    //     return private_keys.keys.map(show_identity_key);
    // }, [private_keys]);
    const [identity_list, setIdentityList] = useState<ShowIdentityKey[] | undefined>();
    useEffect(() => {
        const new_identity_list = (() => {
            if (!private_keys) return undefined;
            return private_keys.keys.map(show_identity_key);
        })();
        if (!same(new_identity_list, identity_list)) setIdentityList(new_identity_list);
    }, [private_keys, identity_list]);

    return { current_identity, identity_list };
};

const show_identity_key = (identity_key: IdentityKey): ShowIdentityKey => ({
    id: identity_key.id,
    created: identity_key.created,
    name: identity_key.name,
    icon: identity_key.icon,
    address: inner_get_current_address(identity_key),
});
