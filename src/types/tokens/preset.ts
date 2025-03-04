import { is_same_token_info, match_combined_token_info, TokenTag, type CombinedTokenInfo, type TokenInfo } from ".";
import { IcTokenStandard, type IcTokenInfo } from "./ic";

// IC
import TOKEN_IC_ICP_SVG from "data-base64:~assets/svg/tokens/ic/ICP.min.svg";
// CK
import TOKEN_IC_CK_BTC_SVG from "data-base64:~assets/svg/tokens/ic/ck/ckBTC.min.svg";
import TOKEN_IC_CK_ETH_SVG from "data-base64:~assets/svg/tokens/ic/ck/ckETH.min.svg";
import TOKEN_IC_CK_USDT_SVG from "data-base64:~assets/svg/tokens/ic/ck/ckUSDT.min.svg";
import TOKEN_IC_CK_USDC_SVG from "data-base64:~assets/svg/tokens/ic/ck/ckUSDC.min.svg";
// SNS
import TOKEN_IC_SNS_ICS_PNG from "data-base64:~assets/svg/tokens/ic/sns/ICS.png";


const PRESET_LOGO: Record<string, string> = {
    'ic#ryjl3-tyaaa-aaaaa-aaaba-cai': TOKEN_IC_ICP_SVG,
    // CK
    'ic#mxzaz-hqaaa-aaaar-qaada-cai': TOKEN_IC_CK_BTC_SVG,
    'ic#ss2fx-dyaaa-aaaar-qacoq-cai': TOKEN_IC_CK_ETH_SVG,
    'ic#cngnf-vqaaa-aaaar-qag4q-cai': TOKEN_IC_CK_USDT_SVG,
    'ic#xevnm-gaaaa-aaaar-qafnq-cai': TOKEN_IC_CK_USDC_SVG,
    // SNS
    // 'ic#2ouva-viaaa-aaaaq-aaamq-cai': "",
    'ic#ca6gz-lqaaa-aaaaq-aacwa-cai': TOKEN_IC_SNS_ICS_PNG,
}

export const get_token_logo = (info: CombinedTokenInfo): string | undefined => {
    return match_combined_token_info(info, {
        ic: (ic) => PRESET_LOGO[`ic#${ic.canister_id}`],
    });
}

const TOKEN_INFO_IC_ICP : IcTokenInfo = { canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'Internet Computer', symbol: 'ICP', decimals:  8, fee: '10000' }; // fee 0.0001 ICP
// CK
const TOKEN_INFO_IC_CK_BTC : IcTokenInfo = { canister_id: 'mxzaz-hqaaa-aaaar-qaada-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckBTC',  symbol: 'ckBTC',  decimals:  8, fee:            '10' }; // fee 0.0000001 ckBTC
const TOKEN_INFO_IC_CK_ETH : IcTokenInfo = { canister_id: 'ss2fx-dyaaa-aaaar-qacoq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckETH',  symbol: 'ckETH',  decimals: 18, fee: '2000000000000' }; // fee 0.000002 ckETH
const TOKEN_INFO_IC_CK_USDT: IcTokenInfo = { canister_id: 'cngnf-vqaaa-aaaar-qag4q-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckUSDT', symbol: 'ckUSDT', decimals:  6, fee:         '10000' }; // fee 0.01 ckUSDT
const TOKEN_INFO_IC_CK_USDC: IcTokenInfo = { canister_id: 'xevnm-gaaaa-aaaar-qafnq-cai', standards: [IcTokenStandard.ICRC1, IcTokenStandard.ICRC2], name: 'ckUSDC', symbol: 'ckUSDC', decimals:  6, fee:         '10000' }; // fee 0.01 ckUSDC
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
    { info: { ic: TOKEN_INFO_IC_CK_BTC  }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_ETH  }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_USDT }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    { info: { ic: TOKEN_INFO_IC_CK_USDC }, tags: [TokenTag.ChainIc, TokenTag.ChainIcCk] },
    // SNS
    { info: { ic: TOKEN_INFO_IC_SNS_CHAT }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
    { info: { ic: TOKEN_INFO_IC_SNS_ICS  }, tags: [TokenTag.ChainIc, TokenTag.ChainIcSns] },
];

export const is_known_token = (token: TokenInfo): boolean => !!PRESET_ALL_TOKEN_INFO.find(t => is_same_token_info(t, token))
