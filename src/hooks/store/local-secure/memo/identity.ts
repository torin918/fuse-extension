import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { verify_password } from '~lib/password';
import { random_account_icon } from '~lib/utils/account_icon';
import { same } from '~lib/utils/same';
import {
    is_same_combined_identity_key,
    match_combined_identity_key,
    type CombinedIdentityKey,
    type CombinedShowIdentityKey,
    type IdentityId,
    type IdentityKey,
    type PrivateKeys,
    type ShowIdentityKey,
} from '~types/identity';

import { inner_get_current_address } from './current_address';

export const useIdentityKeysBy = (
    password_hashed: string,
    private_keys: PrivateKeys | undefined,
    setPrivateKeys: (value: PrivateKeys) => Promise<void>,
): {
    current_identity: IdentityId | undefined;
    identity_list: ShowIdentityKey[] | undefined;
    showMnemonic: (id: IdentityId, password: string) => Promise<string | boolean | undefined>;
    showPrivateKey: (id: IdentityId, password: string) => Promise<string | boolean | undefined>;
    isKeyExist: (key: CombinedIdentityKey) => Promise<boolean>;
    deleteIdentity: (id: IdentityId, password: string) => Promise<boolean | undefined>;
    pushIdentity: (key: CombinedIdentityKey) => Promise<boolean | undefined>;
    updateIdentity: (id: IdentityId, name: string, icon: string) => Promise<boolean | undefined>;
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
            return private_keys.keys.map((key) => show_identity_key(private_keys, key));
        })();
        if (!same(new_identity_list, identity_list)) setIdentityList(new_identity_list);
    }, [private_keys, identity_list]);

    // query
    const showMnemonic = useCallback(
        async (id: IdentityId, password: string): Promise<string | boolean | undefined> => {
            const checked = await verify_password(password_hashed, password);
            if (!checked) return false;
            if (!private_keys) return undefined;
            const identity = private_keys.keys.find((i) => i.id === id);
            if (!identity) return undefined;
            return match_combined_identity_key(identity.key, {
                mnemonic: (m) => m.mnemonic,
                private_key: () => undefined,
            });
        },
        [private_keys, password_hashed],
    );
    const showPrivateKey = useCallback(
        async (id: IdentityId, password: string): Promise<string | boolean | undefined> => {
            const checked = await verify_password(password_hashed, password);
            if (!checked) return false;
            if (!private_keys) return undefined;
            const identity = private_keys.keys.find((i) => i.id === id);
            if (!identity) return undefined;
            return match_combined_identity_key(identity.key, {
                mnemonic: () => undefined,
                private_key: (pk) => pk.private_key,
            });
        },
        [private_keys, password_hashed],
    );
    const isKeyExist = useCallback(
        async (key: CombinedIdentityKey): Promise<boolean> => {
            if (!private_keys) return false;
            return !!private_keys.keys.find((identity) => is_same_combined_identity_key(identity.key, key));
        },
        [private_keys],
    );

    // delete
    const deleteIdentity = useCallback(
        async (id: IdentityId, password: string): Promise<boolean | undefined> => {
            const checked = await verify_password(password_hashed, password);
            if (!checked) return false;
            if (!private_keys) return undefined;
            if (private_keys.current === id) return false; // can not delete current identity
            const identity = private_keys?.keys.find((i) => i.id === id);
            if (!identity) return undefined; // can not find account
            if (
                private_keys.mnemonic &&
                match_combined_identity_key(identity.key, {
                    mnemonic: (m) => m.mnemonic === private_keys.mnemonic,
                    private_key: () => false,
                })
            ) {
                return undefined; // can not delete main account
            }
            const new_keys = private_keys.keys.filter((i) => i.id !== id);
            await setPrivateKeys({ mnemonic: private_keys.mnemonic, current: private_keys.current, keys: new_keys });
            return true;
        },
        [password_hashed, private_keys, setPrivateKeys],
    );

    // push
    const pushIdentity = useCallback(
        async (key: CombinedIdentityKey): Promise<boolean | undefined> => {
            if (!private_keys) return undefined;

            if (private_keys.keys.find((identity) => is_same_combined_identity_key(identity.key, key))) {
                return false; // already exist
            }
            const id = uuid();
            const now = Date.now();
            const new_keys: IdentityKey[] = [
                ...private_keys.keys,
                {
                    id,
                    created: now,
                    updated: now,
                    name: `Account #${private_keys.keys.length + 1}`,
                    icon: random_account_icon(),
                    key,
                },
            ];
            await setPrivateKeys({
                mnemonic: private_keys.mnemonic,
                current: private_keys.current, // ? change to current ?
                keys: new_keys,
            });
            return true;
        },
        [private_keys, setPrivateKeys],
    );

    // update
    const updateIdentity = useCallback(
        async (id: IdentityId, name: string, icon: string): Promise<boolean | undefined> => {
            name = name.trim();
            icon = icon.trim();
            if (32 < name.length) return false;
            if (256 < icon.length) return false;

            if (!private_keys) return undefined;
            const identity = private_keys?.keys.find((i) => i.id === id);
            if (!identity) return undefined; // can not find account

            let changed = false;
            if (identity.name !== name) {
                identity.name = name;
                changed = true;
            }
            if (identity.icon !== icon) {
                identity.icon = icon;
                changed = true;
            }

            if (changed) {
                identity.updated = Date.now();
                await setPrivateKeys({
                    mnemonic: private_keys.mnemonic,
                    current: private_keys.current,
                    keys: [...private_keys.keys],
                });
            }

            return true;
        },
        [private_keys, setPrivateKeys],
    );

    return {
        current_identity,
        identity_list,
        showMnemonic,
        showPrivateKey,
        isKeyExist,
        deleteIdentity,
        pushIdentity,
        updateIdentity,
    };
};

const show_identity_key = (private_keys: PrivateKeys, identity_key: IdentityKey): ShowIdentityKey => ({
    id: identity_key.id,
    created: identity_key.created,
    name: identity_key.name,
    icon: identity_key.icon,
    address: inner_get_current_address(identity_key),
    key: match_combined_identity_key<CombinedShowIdentityKey>(identity_key.key, {
        mnemonic: (mnemonic) => ({ type: 'mnemonic', parsed: mnemonic.parsed }),
        private_key: (private_key) => ({ type: 'private_key', chain: private_key.chain }),
    }),

    deletable:
        private_keys.keys.length > 1 &&
        private_keys.current !== identity_key.id &&
        match_combined_identity_key(identity_key.key, {
            mnemonic: (m) => m.mnemonic !== private_keys.mnemonic,
            private_key: () => true,
        }),
});
