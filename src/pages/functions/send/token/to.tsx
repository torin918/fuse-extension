import { isAccountHex, isCanisterIdText, isPrincipalText } from '@choptop/haw';
import { Button } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
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

    const [amount, setAmount] = useState('0');

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
                            <span className="pr-3 text-[#EEEEEE]">800.12</span>
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
                                <span className="text-sm text-[#EEEEEE]">0.0000001ICP</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-5">
                        <Button
                            className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                            isDisabled={!amount || parseFloat(amount) <= 0}
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
