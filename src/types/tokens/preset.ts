// prettier-ignore // cSpell:words eurc
import { is_same_token_info, match_combined_token_info, TokenTag, type CombinedTokenInfo, type TokenInfo } from ".";
import { IcTokenStandard, type IcTokenInfo } from "./ic";
import { get_cached_data } from "~hooks/store";

// IC
import TOKEN_IC_ICP_SVG from 'data-base64:~assets/svg/tokens/ic/ICP.min.svg';
// CK
import TOKEN_IC_CK_BTC_SVG    from 'data-base64:~assets/svg/tokens/ic/ck/ckBTC.min.svg';
import TOKEN_IC_CK_USDT_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckUSDT.min.svg';
import TOKEN_IC_CK_USDC_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckUSDC.min.svg';
import TOKEN_IC_CK_ETH_SVG    from 'data-base64:~assets/svg/tokens/ic/ck/ckETH.min.svg';
import TOKEN_IC_CK_LINK_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckLINK.min.svg';
import TOKEN_IC_CK_OCT_SVG    from 'data-base64:~assets/svg/tokens/ic/ck/ckOCT.min.svg';
import TOKEN_IC_CK_PEPE_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckPEPE.min.svg';
import TOKEN_IC_CK_EURC_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckEURC.min.svg';
import TOKEN_IC_CK_SHIB_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckSHIB.min.svg';
import TOKEN_IC_CK_XAUT_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckXAUT.min.svg';
import TOKEN_IC_CK_WSTETH_SVG from 'data-base64:~assets/svg/tokens/ic/ck/ckWSTETH.min.svg';
import TOKEN_IC_CK_UNI_SVG    from 'data-base64:~assets/svg/tokens/ic/ck/ckUNI.min.svg';
import TOKEN_IC_CK_WBTC_SVG   from 'data-base64:~assets/svg/tokens/ic/ck/ckWBTC.min.svg';
// SNS
import TOKEN_IC_SNS_CHAT_PNG from "data-base64:~assets/svg/tokens/ic/sns/CHAT.png";
import TOKEN_IC_SNS_ICS_PNG from "data-base64:~assets/svg/tokens/ic/sns/ICS.png";

const PRESET_LOGO: Record<string, string> = {
    'ic#ryjl3-tyaaa-aaaaa-aaaba-cai': TOKEN_IC_ICP_SVG,
    // CK
    'ic#mxzaz-hqaaa-aaaar-qaada-cai': TOKEN_IC_CK_BTC_SVG,
    'ic#cngnf-vqaaa-aaaar-qag4q-cai': TOKEN_IC_CK_USDT_SVG,
    'ic#xevnm-gaaaa-aaaar-qafnq-cai': TOKEN_IC_CK_USDC_SVG,
    'ic#ss2fx-dyaaa-aaaar-qacoq-cai': TOKEN_IC_CK_ETH_SVG,
    'ic#g4tto-rqaaa-aaaar-qageq-cai': TOKEN_IC_CK_LINK_SVG,
    'ic#ebo5g-cyaaa-aaaar-qagla-cai': TOKEN_IC_CK_OCT_SVG,
    'ic#etik7-oiaaa-aaaar-qagia-cai': TOKEN_IC_CK_PEPE_SVG,
    'ic#pe5t5-diaaa-aaaar-qahwa-cai': TOKEN_IC_CK_EURC_SVG,
    'ic#fxffn-xiaaa-aaaar-qagoa-cai': TOKEN_IC_CK_SHIB_SVG,
    'ic#nza5v-qaaaa-aaaar-qahzq-cai': TOKEN_IC_CK_XAUT_SVG,
    'ic#j2tuh-yqaaa-aaaar-qahcq-cai': TOKEN_IC_CK_WSTETH_SVG,
    'ic#ilzky-ayaaa-aaaar-qahha-cai': TOKEN_IC_CK_UNI_SVG,
    'ic#bptq2-faaaa-aaaar-qagxq-cai': TOKEN_IC_CK_WBTC_SVG,
    // SNS
    'ic#2ouva-viaaa-aaaaq-aaamq-cai': TOKEN_IC_SNS_CHAT_PNG,
    'ic#ca6gz-lqaaa-aaaaq-aacwa-cai': TOKEN_IC_SNS_ICS_PNG,
}

export const get_token_logo_key = (token: {ic: {canister_id: string}}): string => {
    if ('ic' in token) return `token:ic:${token.ic.canister_id}:logo`;
    return ''
}

export const get_token_logo = async (info: CombinedTokenInfo): Promise<string | undefined> => {
    const preset = match_combined_token_info(info, {
        ic: (ic) => PRESET_LOGO[`ic#${ic.canister_id}`],
    });
    if (preset) return preset;
    const key = get_token_logo_key(info)
    return get_cached_data(key, async () => undefined, 1000 * 60 * 60 * 24  * 365 * 100)
}

const TOKEN_INFO_IC_ICP : IcTokenInfo = { canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'Internet Computer', symbol: 'ICP', decimals:  8, fee: '10000' }; // fee 0.0001 ICP
// CK
const TOKEN_INFO_IC_CK_BTC    : IcTokenInfo = { canister_id: 'mxzaz-hqaaa-aaaar-qaada-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckBTC',    symbol: 'ckBTC',    decimals:  8, fee:                     '10' }; // fee 0.0000001 ckBTC
const TOKEN_INFO_IC_CK_USDT   : IcTokenInfo = { canister_id: 'cngnf-vqaaa-aaaar-qag4q-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckUSDT',   symbol: 'ckUSDT',   decimals:  6, fee:                  '10000' }; // fee 0.01 ckUSDT
const TOKEN_INFO_IC_CK_USDC   : IcTokenInfo = { canister_id: 'xevnm-gaaaa-aaaar-qafnq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckUSDC',   symbol: 'ckUSDC',   decimals:  6, fee:                  '10000' }; // fee 0.01 ckUSDC
const TOKEN_INFO_IC_CK_ETH    : IcTokenInfo = { canister_id: 'ss2fx-dyaaa-aaaar-qacoq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckETH',    symbol: 'ckETH',    decimals: 18, fee:          '2000000000000' }; // fee 0.000002 ckETH
const TOKEN_INFO_IC_CK_LINK   : IcTokenInfo = { canister_id: 'g4tto-rqaaa-aaaar-qageq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckLINK',   symbol: 'ckLINK',   decimals: 18, fee:        '100000000000000' }; // fee 0.0001 ckLINK
const TOKEN_INFO_IC_CK_OCT    : IcTokenInfo = { canister_id: 'ebo5g-cyaaa-aaaar-qagla-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckOCT',    symbol: 'ckOCT',    decimals: 18, fee:      '34000000000000000' }; // fee 0.034 ckOCT
const TOKEN_INFO_IC_CK_PEPE   : IcTokenInfo = { canister_id: 'etik7-oiaaa-aaaar-qagia-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckPEPE',   symbol: 'ckPEPE',   decimals: 18, fee: '1000000000000000000000' }; // fee 1000 ckPEPE
const TOKEN_INFO_IC_CK_EURC   : IcTokenInfo = { canister_id: 'pe5t5-diaaa-aaaar-qahwa-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckEURC',   symbol: 'ckEURC',   decimals:  6, fee:                  '10000' }; // fee 0.01 ckEURC
const TOKEN_INFO_IC_CK_SHIB   : IcTokenInfo = { canister_id: 'fxffn-xiaaa-aaaar-qagoa-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckSHIB',   symbol: 'ckSHIB',   decimals: 18, fee:  '100000000000000000000' }; // fee 100 ckSHIB
const TOKEN_INFO_IC_CK_XAUT   : IcTokenInfo = { canister_id: 'nza5v-qaaaa-aaaar-qahzq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckXAUT',   symbol: 'ckXAUT',   decimals:  6, fee:                      '1' }; // fee 0.000001 ckXAUT
const TOKEN_INFO_IC_CK_WSTETH : IcTokenInfo = { canister_id: 'j2tuh-yqaaa-aaaar-qahcq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckWSTETH', symbol: 'ckWSTETH', decimals: 18, fee:          '1000000000000' }; // fee 0.000001 ckWSTETH
const TOKEN_INFO_IC_CK_UNI    : IcTokenInfo = { canister_id: 'ilzky-ayaaa-aaaar-qahha-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckUNI',    symbol: 'ckUNI',    decimals: 18, fee:       '1000000000000000' }; // fee 0.001 ckUNI
const TOKEN_INFO_IC_CK_WBTC   : IcTokenInfo = { canister_id: 'bptq2-faaaa-aaaar-qagxq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckWBTC',   symbol: 'ckWBTC',   decimals:  8, fee:                     '10' }; // fee 0.0000001 ckWBTC
// SNS
const TOKEN_INFO_IC_SNS_CHAT: IcTokenInfo = { canister_id: '2ouva-viaaa-aaaaq-aaamq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'CHAT',          symbol: 'CHAT', decimals: 8, fee:  '100000' }; // fee 0.001 CHAT
const TOKEN_INFO_IC_SNS_ICS : IcTokenInfo = { canister_id: 'ca6gz-lqaaa-aaaaq-aacwa-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ICPSwap Token', symbol:  'ICS', decimals: 8, fee: '1000000' }; // fee 0.01 ICS


export const DEFAULT_TOKEN_INFO: TokenInfo[] = [
    { info: { ic: TOKEN_INFO_IC_ICP }, tags: [TokenTag.ChainIc] },
    // CK
    { info: { ic: TOKEN_INFO_IC_CK_BTC }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_ETH }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    // SNS
    { info: { ic: TOKEN_INFO_IC_SNS_CHAT }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
];

export const PRESET_ALL_TOKEN_INFO: TokenInfo[] = [
    { info: { ic: TOKEN_INFO_IC_ICP     }, tags: [TokenTag.ChainIc] },
    // CK
    { info: { ic: TOKEN_INFO_IC_CK_BTC    }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_USDT   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_USDC   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_ETH    }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_LINK   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_OCT    }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_PEPE   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_EURC   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_SHIB   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_XAUT   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_WSTETH }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_UNI    }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_WBTC   }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    // SNS
    { info: { ic: TOKEN_INFO_IC_SNS_CHAT }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
    { info: { ic: TOKEN_INFO_IC_SNS_ICS  }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
];

export const is_known_token = (token: TokenInfo): boolean => !!PRESET_ALL_TOKEN_INFO.find(t => is_same_token_info(t, token))
