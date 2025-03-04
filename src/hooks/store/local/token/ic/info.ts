import { anonymous } from '@choptop/haw';
import { useEffect, useState } from 'react';

import type { Storage } from '@plasmohq/storage';

import { useCachedStoreData, type DataMetadata } from '~hooks/store/metadata';
import { icrc1_decimals, icrc1_fee, icrc1_name, icrc1_symbol } from '~lib/canisters/icrc1';
import { get_canister_standards } from '~lib/canisters/standards';
import { get_canister_status } from '~lib/canisters/status';
import { IcTokenStandard, type IcTokenInfo } from '~types/tokens/ic';

import { LOCAL_KEY_TOKEN_INFO_IC } from '../../../keys';
import { useTokenInfoUpdatedIcInner } from './info_updated';

// ! always try to use this value to avoid BLINK
type DataType = Record<string, IcTokenInfo>;
const get_key = (): string => LOCAL_KEY_TOKEN_INFO_IC;
const get_default_value = (): DataType => ({});
let cached_value = get_default_value();
const get_cached_value = (): DataType => cached_value;
const set_cached_value = (value: DataType): DataType => (cached_value = value);
const meta: DataMetadata<DataType, undefined> = {
    get_key,
    get_default_value,
    get_cached_value,
    set_cached_value,
};

// token info ic -> // * local
export const useTokenInfoIcInner = (storage: Storage): [DataType, (value: DataType) => Promise<void>] =>
    useCachedStoreData(storage, meta, undefined);

const get_token_info_ic = async (canister_id: string): Promise<IcTokenInfo | undefined> => {
    const { candid } = await get_canister_status(canister_id);
    if (candid === undefined) return;
    const standards = await get_canister_standards(candid);

    if (standards.includes(IcTokenStandard.ICRC1)) {
        const name = await icrc1_name(anonymous, canister_id);
        const symbol = await icrc1_symbol(anonymous, canister_id);
        const decimals = await icrc1_decimals(anonymous, canister_id);
        const fee = await icrc1_fee(anonymous, canister_id);
        const token: IcTokenInfo = { canister_id, standards, name, symbol, decimals, fee };
        return token;
    } else {
        console.error(`🚀 ~ canister ${canister_id} standards is not match icrc1`, standards);
    }
    return undefined;
};

export const useTokenInfoIcByInitialInner = (storage: Storage, canister_id: string): IcTokenInfo | undefined => {
    const [token_info, setTokenInfo] = useTokenInfoIcInner(storage);

    const [token, setToken] = useState<IcTokenInfo>(token_info[canister_id]);

    // init
    useEffect(() => {
        if (canister_id === undefined) return;
        if (token !== undefined) return;
        get_token_info_ic(canister_id).then((token) => {
            if (token !== undefined) {
                setToken(token);
                setTokenInfo({ ...token_info, [canister_id]: token });
            }
        });
    }, [token, token_info, setTokenInfo, canister_id]);

    return token;
};

export const useTokenInfoIcByRefreshingInner = (storage: Storage, sleep: number) => {
    const [token_info, setTokenInfo] = useTokenInfoIcInner(storage);
    const [token_info_updated, setTokenInfoUpdated] = useTokenInfoUpdatedIcInner(storage);

    // do refresh once
    useEffect(() => {
        if (sleep <= 0) return; // do nothing
        const now = Date.now();
        if (now < token_info_updated + sleep) return; // sleep
        setTokenInfoUpdated(now);
        (async () => {
            const new_token_info: DataType = {};
            for (const canister_id in token_info) {
                const token = await get_token_info_ic(canister_id);
                if (token !== undefined) new_token_info[canister_id] = token;
            }
            setTokenInfo(new_token_info);
        })();
    }, [sleep, token_info_updated, setTokenInfoUpdated, token_info, setTokenInfo]);
};
