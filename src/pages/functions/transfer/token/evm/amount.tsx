import { isPrincipalText } from '@choptop/haw';
import { Button } from '@heroui/react';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Icon from '~components/icon';
import type { GotoFunction } from '~hooks/memo/goto';
import { cn } from '~lib/utils/cn';
import { truncate_principal, truncate_text } from '~lib/utils/text';
import type { Chain } from '~types/chain';

import { NetworkFeeDrawer, type NetworkFee } from './network_fee_drawer';

function FunctionTransferTokenEvmAmountPage({
    address,
    chain,
    logo,
    to,
    goto: _goto,
}: {
    address: string;
    chain: Chain;
    logo?: string;
    to: string;
    goto: GotoFunction;
}) {
    // const toast = useSonnerToast();
    // const [, { pushRecentAddress }] = useRecentAddresses();

    const [amount, setAmount] = useState('0');
    const [hex, setHex] = useState('');
    const [showHexInput, setShowHexInput] = useState(false);

    // current token info
    const current_token = undefined;

    const showUsd = useMemo<string | undefined>(() => {
        if (current_token === undefined) return '0.00';
        if (!amount) return '0.00';

        // return (Number(current_token.price) * Number(amount)).toFixed(2);
    }, [current_token, amount]);

    const [transferring, setTransferring] = useState(false);
    const [current_free, setCurrentFee] = useState<NetworkFee>();
    const onConfirm = useCallback(async () => {
        // if (BigInt(balance) < BigInt(amount_text) + BigInt(token.fee)) {
        //     toast.success('InsufficientFunds');
        //     return;
        // }

        if (transferring) return;

        // do transfer and update balance and push recent

        setTransferring(true);
        setTransferring(false);
    }, [transferring]);

    const sendRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        sendRef.current?.focus();
    }, [sendRef]);

    const freeFef = useRef<HTMLDivElement>(null);

    if (!address || !to) return <></>;

    return (
        <div ref={freeFef} className="flex h-full w-full flex-col justify-between overflow-hidden">
            <div className="flex w-full flex-1 flex-col px-5">
                <div className="my-5 flex w-full justify-center">
                    <img
                        src={logo ?? 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png'}
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
                    {/* TODO: symbol */}
                    {/* <span className="text-5xl font-bold text-white">{token?.symbol}</span> */}
                </div>
                <span className="block w-full py-2 text-center text-base text-[#999999]">${showUsd}</span>
                <div className="flex items-center justify-center text-sm">
                    <span className="pr-2 text-[#999999]">Available:</span>
                    {/* TODO: balance */}
                    {/* <span className="pr-3 text-[#EEEEEE]">{showBalance}</span> */}
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
                    <div className="flex w-full flex-col border-b border-[#333333] px-3 py-4">
                        <div className="text-sm text-[#999999]">Network Fee</div>
                        <NetworkFeeDrawer
                            current_free={current_free}
                            setCurrentFee={setCurrentFee}
                            trigger={
                                <div className="mt-3 flex w-full cursor-pointer items-center justify-between gap-x-3">
                                    <div className="flex-1">
                                        <div className="flex w-full items-center gap-2 text-sm text-[#eee]">
                                            <img
                                                src={
                                                    logo ??
                                                    'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png'
                                                }
                                                className="h-4 w-4 rounded-full"
                                            />
                                            <span>Average | 0.00001937ETH($0.03697)</span>
                                        </div>
                                        <div className="mt-2 text-left text-sm text-[#999]">
                                            Maximum 0.00002247 ETH(S0.0429)
                                        </div>
                                    </div>
                                    <div className={cn('text-xs text-[#999] hover:text-[#FFCF13]')}>
                                        <Icon
                                            name="icon-arrow-right"
                                            className="h-3 w-3 cursor-pointer text-[#999999]"
                                        />
                                    </div>
                                </div>
                            }
                            container={freeFef.current}
                        />
                    </div>
                    <div className="flex w-full flex-col px-3 py-4">
                        <div className="flex w-full items-center justify-between text-sm text-[#999999]">
                            <div>HEX data (optional)</div>
                            <div
                                className={cn(
                                    'rotate-90 cursor-pointer text-xs text-[#EEEEEE] transition-all hover:text-[#FFCF13]',
                                    showHexInput && '-rotate-90',
                                )}
                                onClick={() => setShowHexInput(!showHexInput)}
                            >
                                <Icon name="icon-arrow-right" className="h-3 w-3 cursor-pointer text-[#999999]" />
                            </div>
                        </div>
                        <div className={cn('mt-3', showHexInput ? 'block' : 'hidden')}>
                            <input
                                type="text"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                                className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-2 text-sm text-[#EEEEEE] outline-none duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full p-5">
                <Button
                    className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                    // isDisabled={
                    //     !amount ||
                    //     new BigNumber(amount).lte(new BigNumber(0)) ||
                    //     new BigNumber(showBalance ?? '0').lt(new BigNumber(amount).plus(new BigNumber(showFee ?? '0')))
                    // }
                    onPress={onConfirm}
                    isLoading={transferring}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
}

export default FunctionTransferTokenEvmAmountPage;
