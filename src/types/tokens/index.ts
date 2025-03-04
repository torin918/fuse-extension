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

// <prefix>:token:info:custom => TokenInfo[]
export type CustomTokenInfo = TokenInfo[];

// <prefix>:token:info:current => TokenInfo[]
export type CurrentTokenInfo = TokenInfo[];
