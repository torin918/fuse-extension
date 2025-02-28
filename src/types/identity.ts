import type { IdentityKeyMnemonic } from './keys/mnemonic';
import type { IdentityKeyPrivate } from './keys/private_key';

export type IdentityId = string; // uuid

export type CombinedIdentityKey = { mnemonic: IdentityKeyMnemonic } | { private_key: IdentityKeyPrivate };

export interface IdentityKey {
    id: IdentityId; // uuid
    created: number; // ms
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
    mnemonic?: string; // could not produce new wallet if not exist
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

// show identity

export interface ShowIdentityKey {
    id: IdentityId; // uuid
    created: number; // ms
    name: string; // show identity name
    icon: string;
    address: IdentityAddress;
}
