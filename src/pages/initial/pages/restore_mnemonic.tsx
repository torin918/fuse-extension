import { Button } from '@heroui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Icon from '~components/icon';
import { get_address_by_mnemonic, validate_mnemonic } from '~lib/mnemonic';
import { cn } from '~lib/utils/cn';

function RestoreMnemonicPage({
    onBack,
    mnemonic,
    setMnemonic,
    onNext,
}: {
    onBack: () => void;
    mnemonic: string;
    setMnemonic: (mnemonic: string) => void;
    onNext: () => void;
}) {
    const valid = useMemo(() => {
        if (!mnemonic) return false;
        return validate_mnemonic(mnemonic);
    }, [mnemonic]);

    const address = useMemo(() => {
        if (!valid) return undefined;
        return get_address_by_mnemonic(mnemonic);
    }, [mnemonic, valid]);
    console.assert(address); // TODO maybe useful

    const [mnemonicCount, setMnemonicCount] = useState<number>(12);
    const [mnemonicInputs12, setMnemonicInputs12] = useState<string[]>(Array(12).fill(''));
    const [mnemonicInputs24, setMnemonicInputs24] = useState<string[]>(Array(24).fill(''));

    useEffect(() => setMnemonic(mnemonicInputs12.join(' ')), [setMnemonic, mnemonicInputs12]);
    useEffect(() => setMnemonic(mnemonicInputs24.join(' ')), [setMnemonic, mnemonicInputs24]);

    const handleMnemonic = useCallback(
        (mnemonic: string) => {
            if (!mnemonic) return false;
            while (/^[\s\u3000].*/.test(mnemonic)) mnemonic = mnemonic.slice(1);
            while (/.*[\s\u3000]$/.test(mnemonic)) mnemonic = mnemonic.slice(0, mnemonic.length - 1);
            mnemonic = mnemonic
                .split(/[\s\u3000]+/)
                .join(' ')
                .trim(); // space chars
            const valid = validate_mnemonic(mnemonic);
            if (!valid) return false;

            const words = mnemonic.split(/[\s\u3000]+/); // space chars
            if (mnemonicCount !== words.length) return false;

            if (words.length === 12) setMnemonicInputs12(words);
            if (words.length === 24) setMnemonicInputs24(words);

            setMnemonic(mnemonic);
            return true;
        },
        [mnemonicCount, setMnemonic],
    );

    // TODO TEST
    useEffect(() => {
        setTimeout(() => {
            handleMnemonic('tooth palace artefact ticket rebel limit virus dawn party pet return young');
        }, 300);
    }, [handleMnemonic]);

    return (
        <div className="slide-in-right flex h-full w-full flex-col justify-between">
            <div className="flex h-[58px] items-center justify-between px-5">
                <div className="flex items-center" onClick={onBack}>
                    <Icon
                        name="icon-arrow-left"
                        className="mr-3 h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                    <span className="text-base font-semibold text-[#FFCF13]">Seed Phrase</span>
                </div>
                {/* <div>
                    <Icon
                        name="icon-close"
                        className="h-[20px] w-[20px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                </div> */}
            </div>
            <div className="flex w-full flex-1 flex-col justify-between px-5 pb-5">
                <div className="mt-5 w-full">
                    <div className="flex w-full items-center gap-x-5">
                        <div className="flex cursor-pointer flex-col items-center" onClick={() => setMnemonicCount(12)}>
                            <div className="text-sm text-[#EEEEEE]">
                                <i className="pr-2 not-italic text-[#FFCF13]">12</i>words
                            </div>
                            <span
                                className={cn(`mt-1 h-[3px] w-5 bg-[#FFCF13]`, mnemonicCount === 12 ? '' : 'opacity-0')}
                            ></span>
                        </div>
                        <div className="flex cursor-pointer flex-col items-center" onClick={() => setMnemonicCount(24)}>
                            <div className="text-sm text-[#EEEEEE]">
                                <i className="pr-2 not-italic text-[#FFCF13]">24</i>words
                            </div>
                            <span
                                className={cn(`mt-1 h-[3px] w-5 bg-[#FFCF13]`, mnemonicCount === 24 ? '' : 'opacity-0')}
                            ></span>
                        </div>
                    </div>
                    <div className="custom-scrollbar mt-4 grid max-h-[calc(100vh-200px)] w-full grid-cols-2 gap-4 overflow-y-auto">
                        {mnemonicCount === 12 &&
                            Array.from({ length: 12 }, (_, index) => (
                                <div
                                    key={index}
                                    className="flex h-[48px] items-center rounded-xl border border-[#333333] px-3 duration-300 hover:border-[#FFCF13]"
                                >
                                    <i className="mr-2 text-sm not-italic text-[#999999]">{index + 1}.</i>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="h-[48px] w-full border-transparent bg-transparent text-base text-[#EEEEEE] outline-none"
                                            value={mnemonicInputs12[index]}
                                            onChange={(e) => {
                                                if (!handleMnemonic(e.target.value)) {
                                                    const newInputs = [...mnemonicInputs12];
                                                    newInputs[index] = e.target.value;
                                                    setMnemonicInputs12(newInputs);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        {mnemonicCount === 24 &&
                            Array.from({ length: 24 }, (_, index) => (
                                <div
                                    key={index}
                                    className="flex h-[48px] items-center rounded-xl border border-[#333333] px-3 duration-300 hover:border-[#FFCF13]"
                                >
                                    <i className="mr-2 text-sm not-italic text-[#999999]">{index + 1}.</i>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="h-[48px] w-full border-transparent bg-transparent text-base text-[#EEEEEE] outline-none"
                                            value={mnemonicInputs24[index]}
                                            onChange={(e) => {
                                                if (!handleMnemonic(e.target.value)) {
                                                    const newInputs = [...mnemonicInputs24];
                                                    newInputs[index] = e.target.value;
                                                    setMnemonicInputs24(newInputs);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <Button
                    className="h-[48px] bg-[#FFCF13] text-lg font-semibold text-black"
                    isDisabled={
                        (mnemonicCount === 12
                            ? mnemonicInputs12.some((input) => input.trim() === '')
                            : mnemonicInputs24.some((input) => input.trim() === '')) || !validate_mnemonic(mnemonic)
                    }
                    onPress={onNext}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
}

export default RestoreMnemonicPage;
