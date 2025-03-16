import { get_cached_data } from '~hooks/store/local';

import { is_same_token_info, match_combined_token_info, TokenTag, type CombinedTokenInfo, type TokenInfo } from '..';
import {
    PRESET_ALL_TOKEN_INFO_IC,
    PRESET_LOGO_IC,
    TOKEN_INFO_IC_CK_BTC,
    TOKEN_INFO_IC_CK_ETH,
    TOKEN_INFO_IC_CK_USDC,
    TOKEN_INFO_IC_CK_USDT,
    TOKEN_INFO_IC_ICP,
    TOKEN_INFO_IC_SNS_CHAT,
    TOKEN_INFO_IC_SNS_ICL,
    TOKEN_INFO_IC_SNS_KONG,
    TOKEN_INFO_IC_SNS_OGY,
} from './ic';

export const get_token_logo_key = (
    token:
        | { ic: { canister_id: string } }
        | { ethereum: { address: string } }
        | { ethereum_test_sepolia: { address: string } }
        | { polygon: { address: string } }
        | { polygon_test_amoy: { address: string } }
        | { bsc: { address: string } }
        | { bsc_test: { address: string } },
): string => {
    if ('ic' in token) return `token:ic:${token.ic.canister_id}:logo`;
    if ('ethereum' in token) return `token:ethereum:${token.ethereum.address}:logo`;
    if ('ethereum_test_sepolia' in token)
        return `token:ethereum_test_sepolia:${token.ethereum_test_sepolia.address}:logo`;
    if ('polygon' in token) return `token:polygon:${token.polygon.address}:logo`;
    if ('polygon_test_amoy' in token) return `token:polygon_test_amoy:${token.polygon_test_amoy.address}:logo`;
    if ('bsc' in token) return `token:bsc:${token.bsc.address}:logo`;
    if ('bsc_test' in token) return `token:bsc_test:${token.bsc_test.address}:logo`;
    return '';
};
// evm token logo
const get_token_logo_from_covalent = (address: string, chainId: number): string => {
    return `https://logos.covalenthq.com/tokens/${chainId}/${address.toLowerCase()}.png`;
};
export const get_token_logo = async (info: CombinedTokenInfo): Promise<string | undefined> => {
    const preset = match_combined_token_info(info, {
        ic: (ic) => PRESET_LOGO_IC[`ic#${ic.canister_id}`],
        ethereum: (ethereum) => get_token_logo_from_covalent(ethereum.address, 1),
        ethereum_test_sepolia: (ethereum_test_sepolia) =>
            get_token_logo_from_covalent(ethereum_test_sepolia.address, 11155111),
        polygon: (polygon) => get_token_logo_from_covalent(polygon.address, 137),
        polygon_test_amoy: (polygon_test_amoy) => get_token_logo_from_covalent(polygon_test_amoy.address, 80001),
        bsc: (bsc) => get_token_logo_from_covalent(bsc.address, 56),
        bsc_test: (bsc_test) => get_token_logo_from_covalent(bsc_test.address, 97),
    });
    if (preset) return preset;
    const key = get_token_logo_key(info);
    return get_cached_data(key, async () => undefined, 1000 * 60 * 60 * 24 * 365 * 100);
};

export const DEFAULT_TOKEN_INFO: TokenInfo[] = [
    { info: { ic: TOKEN_INFO_IC_ICP }, tags: [TokenTag.ChainIc] },
    // CK
    { info: { ic: TOKEN_INFO_IC_CK_BTC }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_ETH }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_USDC }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_USDT }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    // SNS
    { info: { ic: TOKEN_INFO_IC_SNS_CHAT }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
    { info: { ic: TOKEN_INFO_IC_SNS_ICL }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
    { info: { ic: TOKEN_INFO_IC_SNS_OGY }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
    { info: { ic: TOKEN_INFO_IC_SNS_KONG }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
];

export const PRESET_ALL_TOKEN_INFO = [...PRESET_ALL_TOKEN_INFO_IC];

export const is_known_token = (token: TokenInfo): boolean =>
    !!PRESET_ALL_TOKEN_INFO.find((t) => is_same_token_info(t, token));
