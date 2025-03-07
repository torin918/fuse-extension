import { anonymous } from '@choptop/haw';
import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import type { Storage } from '@plasmohq/storage';

import { useCachedStoreData1, type DataMetadata1 } from '~hooks/meta/metadata-1';
import { icrc1_balance_of } from '~lib/canisters/icrc1';

import { LOCAL_KEY_TOKEN_BALANCE_IC } from '../../../keys';

// ! always try to use this value to avoid BLINK
type DataType = Record<string, string>; // <prefix>:balance:ic:address => [canister_id => balance]
const get_key = (principal: string): string => LOCAL_KEY_TOKEN_BALANCE_IC(principal);
const get_default_value = (): DataType => ({});
const cached_value: Record<string, DataType> = {};
const get_cached_value = (principal: string): DataType => cached_value[principal] ?? get_default_value();
const set_cached_value = (value: DataType, principal: string): DataType => (cached_value[principal] = value);
const meta: DataMetadata1<DataType, string> = {
    get_key,
    get_default_value,
    get_cached_value,
    set_cached_value,
};

// token balance ic -> // * local
export const useTokenBalanceIcInner = (
    storage: Storage,
    principal: string,
): [DataType, (value: DataType) => Promise<void>] => useCachedStoreData1(storage, meta, principal);

export const useTokenBalanceIcByRefreshingInner = (
    storage: Storage,
    principal: string | undefined,
    canisters: string[],
    sleep: number,
): [(string | undefined)[], { refreshBalance: () => void }] => {
    const [balances, setBalances] = useTokenBalanceIcInner(storage, principal ?? '');

    const [balance, setBalance] = useState<(string | undefined)[]>(
        canisters.map((canister_id) => balances[canister_id]),
    );

    // init
    useEffect(() => {
        if (!storage) return;
        if (principal === undefined || principal === '') return;
        if (!canisters.length) return;
        if (balance.length !== canisters.length)
            return setBalance(canisters.map((canister_id) => balances[canister_id]));
        if (canisters.find((canister_id, index) => !balance[index] && balances[canister_id]))
            return setBalance(canisters.map((canister_id) => balances[canister_id]));
        if (balance.findIndex((b) => b === undefined) < 0) return;
        update_token_balance(principal, canisters, setBalance, balances, setBalances);
    }, [storage, balance, balances, setBalances, canisters, principal]);

    // refresh
    const refreshBalance = useCallback(() => {
        if (!storage) return;
        if (principal === undefined || principal === '') return;
        if (!canisters.length) return;
        update_token_balance(principal, canisters, setBalance, balances, setBalances);
    }, [storage, principal, balances, setBalances, canisters]);

    // schedule
    useInterval(() => refreshBalance(), sleep);

    return [balance, { refreshBalance }];
};

const update_token_balance = (
    principal: string,
    canisters: string[],
    setBalance: (balance: string[]) => void,
    balances: DataType,
    setBalances: (balances: DataType) => void,
) => {
    Promise.all(
        canisters.map(
            async (canister_id): Promise<[string, string]> => [
                canister_id,
                await icrc1_balance_of(anonymous, canister_id, { owner: principal }),
            ],
        ),
    ).then((balance) => {
        setBalance(balance.map(([, b]) => b));
        const bs = { ...balances };
        for (const [canister_id, b] of balance) bs[canister_id] = b;
        setBalances(bs);
    });
};
