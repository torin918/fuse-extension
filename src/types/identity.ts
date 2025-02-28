import type { IdentityKeyMnemonic, MnemonicParsed } from './keys/mnemonic';
import type { IdentityKeyPrivate } from './keys/private_key';

export type IdentityId = string; // uuid

export type CombinedIdentityKey = { mnemonic: IdentityKeyMnemonic } | { private_key: IdentityKeyPrivate };

export interface IdentityKey {
    id: IdentityId; // uuid
    created: number; // ms
    updated: number; // ms
    name: string; // show identity name
    icon: string;
    key: CombinedIdentityKey;
}

export interface IdentityAddress {
    ic?: {
        owner: string;
        account_id: string;
    };
}

export interface PrivateKeys {
    mnemonic: string | undefined; // could not produce new wallet if not exist
    keys: IdentityKey[];
    current: IdentityId; // current identity // uuid
}

export const match_combined_identity_key = <T>(
    self: CombinedIdentityKey,
    {
        mnemonic,
        private_key,
    }: { mnemonic: (mnemonic: IdentityKeyMnemonic) => T; private_key: (private_key: IdentityKeyPrivate) => T },
): T => {
    if ('mnemonic' in self) return mnemonic(self.mnemonic);
    if ('private_key' in self) return private_key(self.private_key);
    throw new Error(`Unknown identity type: ${Object.keys(self)[0]}`);
};

export const match_combined_identity_key_async = <T>(
    self: CombinedIdentityKey,
    {
        mnemonic,
        private_key,
    }: {
        mnemonic: (mnemonic: IdentityKeyMnemonic) => Promise<T>;
        private_key: (private_key: IdentityKeyPrivate) => Promise<T>;
    },
): Promise<T> => {
    if ('mnemonic' in self) return mnemonic(self.mnemonic);
    if ('private_key' in self) return private_key(self.private_key);
    throw new Error(`Unknown identity type: ${Object.keys(self)[0]}`);
};

export const is_same_combined_identity_key = (a: CombinedIdentityKey, b: CombinedIdentityKey): boolean => {
    return match_combined_identity_key(a, {
        mnemonic: (m1) =>
            match_combined_identity_key(b, {
                mnemonic: (m2) =>
                    m1.mnemonic === m2.mnemonic && m1.subaccount === m2.subaccount && m1.parsed === m2.parsed,
                private_key: () => false,
            }),
        private_key: (pk1) =>
            match_combined_identity_key(b, {
                mnemonic: () => false,
                private_key: (pk2) => pk1.private_key === pk2.private_key && pk1.chain === pk2.chain,
            }),
    });
};

// show identity

export type CombinedShowIdentityKey =
    | { type: 'mnemonic'; parsed?: MnemonicParsed }
    | { type: 'private_key'; chain: 'ethereum' | 'solana' };
export interface ShowIdentityKey {
    id: IdentityId; // uuid
    created: number; // ms
    name: string; // show identity name
    icon: string;
    address: IdentityAddress;
    key: CombinedShowIdentityKey;

    deletable: boolean;
}
