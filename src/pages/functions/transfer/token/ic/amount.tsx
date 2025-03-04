import { isPrincipalText } from '@choptop/haw';
import { Button } from '@heroui/react';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NavigateOptions } from 'react-router-dom';

import Icon from '~components/icon';
import { showToast } from '~components/toast';
import { useCurrentConnectedIcIdentity } from '~hooks/memo/identity';
import { useTokenBalanceIcByRefreshing, useTokenInfoIcByInitial } from '~hooks/store';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import { icrc1_transfer, transfer } from '~lib/canisters/icrc1';
import { truncate_principal, truncate_text } from '~lib/utils/text';

function FunctionTransferTokenIcAmountPage({
    canister_id,
    to,
    goto: _goto,
}: {
    canister_id: string;
    to: string;
    goto: (path: string | number, options?: NavigateOptions) => void;
}) {
    const current_identity = useCurrentIdentity();

    const token = useTokenInfoIcByInitial(canister_id);

    const showFee = useMemo<string | undefined>(() => {
        if (token === undefined) return undefined;
        return new BigNumber(token.fee).dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals))).toFixed();
    }, [token]);

    const identity = useCurrentConnectedIcIdentity(current_identity?.id);

    const [balance, { refreshBalance }] = useTokenBalanceIcByRefreshing(identity?.principal, canister_id);
    // console.error(`🚀 ~ FunctionSendTokenToPage ~ balance:`, current_identity, token, identity, balance);

    const showBalance = useMemo<string | undefined>(() => {
        if (token === undefined || balance === undefined) return undefined;
        return new BigNumber(balance).dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals))).toFixed();
    }, [token, balance]);

    const [amount, setAmount] = useState('0');

    const [transferring, setTransferring] = useState(false);
    const onConfirm = useCallback(() => {
        if (!to || !token || !amount || !identity || !balance) return;

        const amount_text = new BigNumber(amount)
            .multipliedBy(new BigNumber(10).pow(new BigNumber(token.decimals)))
            .toFixed()
            .split('.')[0];

        if (BigInt(balance) < BigInt(amount_text) + BigInt(token.fee)) {
            showToast('InsufficientFunds');
            return;
        }

        if (transferring) return;

        const do_transfer = isPrincipalText(to)
            ? async () =>
                  icrc1_transfer(identity, token.canister_id, {
                      from_subaccount: undefined,
                      to: { owner: to, subaccount: undefined },
                      amount: amount_text,
                      fee: undefined,
                      memo: undefined,
                      created_at_time: undefined,
                  })
            : async () =>
                  transfer(identity, token.canister_id, {
                      from_subaccount: identity.account,
                      to,
                      amount: amount_text,
                      fee: token.fee,
                      memo: '0',
                      created_at_time: undefined,
                  });

        setTransferring(true);
        do_transfer()
            .then((height) => {
                showToast(`do transfer successful: ${height}`);
                setTimeout(() => _goto('/', { replace: true }), 10000);
            })
            .catch((e) => showToast(`${e}`, 'error'))
            .finally(() => {
                setTransferring(false);
                refreshBalance(); // update balance again
            });
    }, [token, to, amount, identity, balance, _goto, transferring, refreshBalance]);

    const sendRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        sendRef.current?.focus();
    }, [sendRef]);

    if (!canister_id || !to) return <></>;
    return (
        <div className="flex h-full w-full flex-col justify-between">
            <div className="flex w-full flex-1 flex-col px-5">
                <div className="my-5 flex w-full justify-center">
                    <img
                        src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                        className="h-[50px] w-[50px] rounded-full"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            if (/^\d*\.?\d*$/.test(value)) {
                                setAmount(value);
                            }
                        }}
                        className="h-[48px] min-w-[50px] border-none bg-transparent pr-3 text-right text-5xl font-bold text-white outline-none"
                        style={{ width: `${amount.length + 1}ch` }}
                        ref={sendRef}
                    />
                    <span className="text-5xl font-bold text-white">ICP</span>
                </div>
                <span className="block w-full py-2 text-center text-base text-[#999999]">$0.00</span>
                <div className="flex items-center justify-center text-sm">
                    <span className="pr-2 text-[#999999]">Available:</span>
                    <span className="pr-3 text-[#EEEEEE]">{showBalance}</span>
                    <span className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85">50%</span>
                    <span className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85">Max</span>
                </div>
                <div className="mt-7 w-full rounded-xl bg-[#181818]">
                    <div className="flex w-full justify-between border-b border-[#333333] px-3 py-4">
                        <span className="text-sm text-[#999999]">To</span>
                        <div className="flex items-center">
                            <span className="px-2 text-sm text-[#EEEEEE]">
                                {isPrincipalText(to) ? truncate_principal(to) : truncate_text(to)}
                            </span>
                            <Icon
                                name="icon-copy"
                                className="h-[14px] w-[14px] cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    </div>
                    <div className="flex w-full justify-between px-3 py-4">
                        <span className="text-sm text-[#999999]">Network Fee</span>
                        <span className="text-sm text-[#EEEEEE]">
                            {showFee} {token?.symbol}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full p-5">
                <Button
                    className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                    isDisabled={
                        !amount ||
                        new BigNumber(amount).lte(new BigNumber(0)) ||
                        new BigNumber(showBalance ?? '0').lt(new BigNumber(amount).plus(new BigNumber(showFee ?? '0')))
                    }
                    onPress={onConfirm}
                    isLoading={transferring}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
}

export default FunctionTransferTokenIcAmountPage;
