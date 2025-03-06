// import type { WrappedCandidType, WrappedCandidTypeService } from '@jellypack/runtime/lib/wasm/candid';

import { IcTokenStandard } from '~types/tokens/ic';

const IC_STANDARDS: Record<IcTokenStandard, [string, string][]> = {
    [IcTokenStandard.ICRC1]: [
        [
            'icrc1_transfer',
            '(record { amount : nat; created_at_time : opt nat64; fee : opt nat; from_subaccount : opt vec nat8; memo : opt vec nat8; to : record { owner : principal; subaccount : opt vec nat8 } }) -> (variant { Err : variant { BadBurn : record { min_burn_amount : nat }; BadFee : record { expected_fee : nat }; CreatedInFuture : record { ledger_time : nat64 }; Duplicate : record { duplicate_of : nat }; GenericError : record { error_code : nat; message : text }; InsufficientFunds : record { balance : nat }; TemporarilyUnavailable; TooOld }; Ok : nat })',
        ],
        ['icrc1_total_supply', '() -> (nat) query'],
        ['icrc1_balance_of', '(record { owner : principal; subaccount : opt vec nat8 }) -> (nat) query'],
        ['icrc1_supported_standards', '() -> (vec record { name : text; url : text }) query'],
        ['icrc1_symbol', '() -> (text) query'],
        ['icrc1_decimals', '() -> (nat8) query'],
        ['icrc1_minting_account', '() -> (opt record { owner : principal; subaccount : opt vec nat8 }) query'],
        [
            'icrc1_metadata',
            '() -> (vec record { text; variant { Blob : vec nat8; Int : int; Nat : nat; Text : text } }) query',
        ],
        ['icrc1_name', '() -> (text) query'],
        ['icrc1_fee', '() -> (nat) query'],
    ],
    [IcTokenStandard.ICRC2]: [
        [
            'icrc2_approve',
            '(record { amount : nat; created_at_time : opt nat64; expected_allowance : opt nat; expires_at : opt nat64; fee : opt nat; from_subaccount : opt vec nat8; memo : opt vec nat8; spender : record { owner : principal; subaccount : opt vec nat8 } }) -> (variant { Err : variant { AllowanceChanged : record { current_allowance : nat }; BadFee : record { expected_fee : nat }; CreatedInFuture : record { ledger_time : nat64 }; Duplicate : record { duplicate_of : nat }; Expired : record { ledger_time : nat64 }; GenericError : record { error_code : nat; message : text }; InsufficientFunds : record { balance : nat }; TemporarilyUnavailable; TooOld }; Ok : nat })',
        ],
        [
            'icrc2_transfer_from',
            '(record { amount : nat; created_at_time : opt nat64; fee : opt nat; from : record { owner : principal; subaccount : opt vec nat8 }; memo : opt vec nat8; spender_subaccount : opt vec nat8; to : record { owner : principal; subaccount : opt vec nat8 } }) -> (variant { Err : variant { BadBurn : record { min_burn_amount : nat }; BadFee : record { expected_fee : nat }; CreatedInFuture : record { ledger_time : nat64 }; Duplicate : record { duplicate_of : nat }; GenericError : record { error_code : nat; message : text }; InsufficientAllowance : record { allowance : nat }; InsufficientFunds : record { balance : nat }; TemporarilyUnavailable; TooOld }; Ok : nat })',
        ],
        [
            'icrc2_allowance',
            '(record { account : record { owner : principal; subaccount : opt vec nat8 }; spender : record { owner : principal; subaccount : opt vec nat8 } }) -> (record { allowance : nat; expires_at : opt nat64 }) query',
        ],
        ['icrc1_supported_standards', '() -> (vec record { name : text; url : text }) query'],
    ],
};

const is_methods_match = (methods: [string, string][], name: string, func: string): boolean => {
    const method = methods.find(([n]) => n === name);
    if (!method) return false;

    if (method[1] !== func) console.error('got difference func but have same name', [method[1], func]);

    return method[1] === func;
};

const is_methods_match_standards = (methods: [string, string][], required: [string, string][]): boolean => {
    for (const [name, func] of required) {
        if (!is_methods_match(methods, name, func)) return false;
    }
    return true;
};

export const get_canister_standards = async (candid: string): Promise<IcTokenStandard[]> => {
    // ! The dynamic import module avoids page stalling caused by loading large files
    const { parse_candid_type_to_text, parse_service_candid } = await import('@jellypack/wasm-react');

    const service = await parse_service_candid(candid, (s) => s, false);
    // console.error(`🚀 ~ const get_canister_standards= ~ service:`, service);
    const methods = await Promise.all(
        (service.methods ?? []).map(async ([name, func]): Promise<[string, string]> => {
            return parse_candid_type_to_text({ func }, false).then((func) => {
                return [
                    name,
                    func.substring(5), // trim start 'func '
                ];
            });
        }),
    );
    // console.error(`🚀 ~ const get_canister_standards= ~ methods:`, methods);
    const standards = Object.keys(IC_STANDARDS) as IcTokenStandard[];
    return standards.filter((standard) => is_methods_match_standards(methods, IC_STANDARDS[standard]));
};

// const parse_service_candid = async <T>(
//     candid: string,
//     mapping: (s: WrappedCandidTypeService) => T,
//     debug: boolean,
// ): Promise<T> => {
//     const response = await fetch('https://wasm-api.fusewallet.top/parse_service_candid', {
//         method: 'PUT',
//         body: JSON.stringify({ candid }),
//     });
//     const json = await response.json();
//     if (json.code !== 0) throw new Error(json.message);
//     const data = JSON.parse(json.data.result);
//     if (data.err) throw new Error(data.err);
//     const service = JSON.parse(data.ok);
//     if (debug) console.error('🚀 ~ const parse_service_candid= ~ service:', service);
//     return mapping(service);
// };

// const parse_candid_type_to_text = async (ty: WrappedCandidType, debug: boolean): Promise<string> => {
//     const response = await fetch('https://wasm-api.fusewallet.top/parse_candid_type_to_text', {
//         method: 'PUT',
//         body: JSON.stringify({ ty: JSON.stringify(ty) }),
//     });
//     const json = await response.json();
//     if (json.code !== 0) throw new Error(json.message);
//     const data = JSON.parse(json.data.result);
//     if (debug) console.debug(`🚀 ~ const parse_candid_type_to_text= ~ data:`, data);
//     if (data.err) throw new Error(data.err);
//     return data.ok;
// };
