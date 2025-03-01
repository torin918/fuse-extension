import {
    anonymous,
    getActorCreatorByAgent,
    isAccountHex,
    isCanisterIdText,
    isPrincipalText,
    principal2account,
    type ConnectedIdentity,
} from '@choptop/haw';
import { Button } from '@heroui/react';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { get_unique_ic_agent } from '~hooks/store/agent';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import {
    icrc1_balance_of,
    icrc1_decimals,
    icrc1_fee,
    icrc1_symbol,
    icrc1_transfer,
    transfer,
} from '~lib/canisters/icrc1';
import { truncate_principal, truncate_text } from '~lib/utils/text';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionSendTokenToPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();

    const { token, to } = useParams();

    useEffect(() => {
        if (!token || !isCanisterIdText(token)) _goto('/', { replace: true });
        if (!to || (!isPrincipalText(to) && !isAccountHex(to))) _goto(-1);
    }, [_goto, token, to]);

    const current_identity = useCurrentIdentity();

    // const [token_name, setTokenName] = useState<string>();
    const [token_symbol, setTokenSymbol] = useState<string>();
    const [token_fee, setTokenFee] = useState<string>();
    const [token_decimals, setDecimals] = useState<number>();
    useEffect(() => {
        if (!token) return;
        // icrc1_name(anonymous, token).then(setTokenName);
        icrc1_symbol(anonymous, token).then(setTokenSymbol);
        icrc1_decimals(anonymous, token).then(setDecimals);
        icrc1_fee(anonymous, token).then(setTokenFee);
    }, [token]);
    const showFee = useMemo<string | undefined>(() => {
        if (token_fee === undefined || token_decimals === undefined) return undefined;
        return new BigNumber(token_fee).dividedBy(new BigNumber(10).pow(new BigNumber(token_decimals))).toFixed();
    }, [token_fee, token_decimals]);

    const [identity, setIdentity] = useState<ConnectedIdentity>();
    useEffect(() => {
        if (!current_identity) return setIdentity(undefined);
        const agent = get_unique_ic_agent();
        if (!agent) return setIdentity(undefined);
        agent.getPrincipal().then((p) => {
            const principal = p.toText();
            setIdentity({
                principal,
                account: principal2account(principal),
                agent,
                creator: getActorCreatorByAgent(agent),
            });
        });
    }, [current_identity]);

    const [balance, setBalance] = useState<string>();
    console.debug(`🚀 ~ FunctionSendTokenToPage ~ balance:`, balance);
    useEffect(() => {
        if (!token || !identity) return setBalance(undefined);
        icrc1_balance_of(identity, token, { owner: identity.principal }).then(setBalance);
    }, [token, identity]);
    const showBalance = useMemo<string | undefined>(() => {
        if (token_decimals === undefined || balance === undefined) return undefined;
        return new BigNumber(balance).dividedBy(new BigNumber(10).pow(new BigNumber(token_decimals))).toFixed();
    }, [token_decimals, balance]);

    const [amount, setAmount] = useState('0');

    const [transferring, setTransferring] = useState(false);
    const onConfirm = useCallback(() => {
        if (!token || !to || !token_decimals || !token_fee || !amount || !identity || !balance) return;

        const amount_text = new BigNumber(amount)
            .multipliedBy(new BigNumber(10).pow(new BigNumber(token_decimals)))
            .toFixed()
            .split('.')[0];

        if (BigInt(balance) < BigInt(amount_text) + BigInt(token_fee)) {
            showToast('InsufficientFunds');
            return;
        }

        if (transferring) return;

        const do_transfer = isPrincipalText(to)
            ? async () =>
                  icrc1_transfer(identity, token, {
                      from_subaccount: undefined,
                      to: { owner: to, subaccount: undefined },
                      amount: amount_text,
                      fee: undefined,
                      memo: undefined,
                      created_at_time: undefined,
                  })
            : async () =>
                  transfer(identity, token, {
                      from_subaccount: identity.account,
                      to,
                      amount: amount_text,
                      fee: token_fee,
                      memo: '0',
                      created_at_time: undefined,
                  });

        setTransferring(true);
        do_transfer()
            .then((height) => {
                showToast(`do transfer successful: ${height}`);
                setTimeout(() => _goto('/'), 10000);
            })
            .catch((e) => showToast(`${e}`, 'error'))
            .finally(() => {
                setTransferring(false);
                icrc1_balance_of(identity, token, { owner: identity.principal }).then(setBalance); // update balance again
            });
    }, [token, to, token_decimals, token_fee, amount, identity, balance, _goto, transferring]);

    const sendRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        sendRef.current?.focus();
    }, [sendRef]);

    if (!token || !to) return <></>;
    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]"
                setHide={setHide}
                header={<FunctionHeader title={'Send'} onBack={() => _goto(-1)} onClose={() => _goto('/')} />}
            >
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
                            <span className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85">
                                50%
                            </span>
                            <span className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85">
                                Max
                            </span>
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
                                    {showFee} {token_symbol}
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
                                new BigNumber(showBalance ?? '0').lt(
                                    new BigNumber(amount).plus(new BigNumber(showFee ?? '0')),
                                )
                            }
                            onPress={onConfirm}
                            isLoading={transferring}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSendTokenToPage;
