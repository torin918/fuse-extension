import { principal2account } from '@choptop/haw';
import type { SignIdentity } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import * as bip39 from 'bip39';
import { HDKey } from 'ethereum-cryptography/hdkey.js';
// import hdkey from 'hdkey';
import * as secp256k1 from 'secp256k1';

import type { IdentityAddress } from '~types/identity';
import type { MnemonicParsed } from '~types/keys/mnemonic';

export const random_mnemonic = (words: 12 | 24) => {
    const mnemonic = bip39.generateMnemonic(words === 12 ? 128 : 256);
    return mnemonic;
};

export const validate_mnemonic = (mnemonic: string) => bip39.validateMnemonic(mnemonic);

export const get_address_by_mnemonic_and_metadata = (
    mnemonic: string,
    subaccount = 0,
    parsed?: MnemonicParsed,
): [IdentityAddress, { ic?: SignIdentity }] => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // const root = hdkey.fromMasterSeed(seed); // ? always failed by assert is not a function
    const root = HDKey.fromMasterSeed(seed);

    // ic
    const [ic, ic_identity] = (() => {
        const { privateKey } = root.derive(`m/44'/223'/0'/0/${subaccount}`);
        const publicKey = secp256k1.publicKeyCreate(new Uint8Array(privateKey ?? []), false);

        const publicKeyArray = new Uint8Array(publicKey).buffer;
        const privateKeyArray = new Uint8Array(privateKey ?? []).buffer;

        const identity =
            parsed?.ic === 'ed25519'
                ? Ed25519KeyIdentity.fromKeyPair(publicKeyArray, privateKeyArray)
                : Secp256k1KeyIdentity.fromKeyPair(publicKeyArray, privateKeyArray); // default secp256k

        const owner = identity.getPrincipal().toText();
        const account_id = principal2account(owner);
        return [{ owner, account_id }, identity];
    })();

    return [{ ic }, { ic: ic_identity }];
};

export const get_address_by_mnemonic = (
    mnemonic: string,
    subaccount: number,
    parsed?: MnemonicParsed,
): IdentityAddress => get_address_by_mnemonic_and_metadata(mnemonic, subaccount, parsed)[0];

const get_all_mnemonic_words = () => bip39.wordlists.english; // cspell: disable-line

export const pick_word_exclude_appeared = (appeared: string[]): string => {
    const words = get_all_mnemonic_words();
    const filtered = words.filter((word) => !appeared.includes(word));
    return filtered[Math.floor(Math.random() * filtered.length)];
};
