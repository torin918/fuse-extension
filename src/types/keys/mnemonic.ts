export interface MnemonicParsed {
    ic?: 'secp256k' | 'ed25519';
}

export interface IdentityKeyMnemonic {
    type: 'mnemonic';
    mnemonic: string;
    subaccount: number;
    parsed?: MnemonicParsed; // how to parse
}
