export enum IcTokenStandard {
    ICRC1 = 'icrc1', // https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-1
    ICRC2 = 'icrc2', // https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-2
}

export interface IcTokenInfo {
    canister_id: string;
    standards: IcTokenStandard[];
    name: string;
    symbol: string;
    decimals: number;
    fee: string;
}

// key:ic => [canister_id => info]
export type IcTokens = Record<string, IcTokenInfo>;

// key:ic:address => [canister_id => balance]
export type IcTokenBalances = Record<string, string>;
