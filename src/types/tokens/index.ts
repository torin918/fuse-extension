import type { IcTokenInfo } from './ic';

export enum TokenTag {
    ChainIc = 'chain-ic',
    ChainIcSns = 'chain-ic-sns',
    ChainIcCk = 'chain-ic-ck',
    ChainIcCustom = 'chain-ic-custom',
}

export interface CombinedTokenInfo {
    ic: IcTokenInfo;
}

export const match_combined_token_info = <T>(self: CombinedTokenInfo, { ic }: { ic: (ic: IcTokenInfo) => T }): T => {
    if ('ic' in self) return ic(self.ic);
    throw new Error('Unknown token info');
};
export const match_combined_token_info_async = async <T>(
    self: CombinedTokenInfo,
    { ic }: { ic: (ic: IcTokenInfo) => Promise<T> },
): Promise<T> => {
    if ('ic' in self) return ic(self.ic);
    throw new Error('Unknown token info');
};

export interface TokenInfo {
    info: CombinedTokenInfo;
    tags: TokenTag[];
}

export const is_same_token_info = (a: TokenInfo, b: TokenInfo): boolean => {
    return match_combined_token_info(a.info, {
        ic: (ic) =>
            match_combined_token_info(b.info, {
                ic: (ic2) => ic.canister_id === ic2.canister_id,
            }),
    });
};
export const get_token_symbol = (token: TokenInfo): string => {
    return match_combined_token_info(token.info, {
        ic: (ic) => ic.symbol,
    });
};

export interface CustomToken {
    created: number;
    updated: number;
    token: TokenInfo;
}

// <prefix>:token:info:custom => TokenInfo[]
export type CustomTokens = CustomToken[];

// <prefix>:token:info:current => TokenInfo[]
export type CurrentTokens = TokenInfo[];
