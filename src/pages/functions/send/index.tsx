import { Button } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

import Icon from '~components/icon';
import type { MainPageState } from '~pages/functions';

function SendPage({ setState }: { setState: (state: MainPageState) => void }) {
    const [inputValue, setInputValue] = useState('');
    const [sendValue, setSendValue] = useState('0');
    const [activeTab, setActiveTab] = useState('one');

    const history_address = [
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
    ];
    const sendRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sendRef.current) {
            sendRef.current.focus();
        }
    }, []);

    return (
        <div className="flex h-screen w-full flex-col justify-between">
            <div className="flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                <div onClick={() => setState('home')}>
                    <Icon
                        name="icon-arrow-left"
                        className="h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"></Icon>
                </div>
                <div className="text-lg">Send</div>
                <div className="w-[14px]" onClick={() => setState('home')}>
                    <Icon
                        name="icon-close"
                        className="h-5 w-5 cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"></Icon>
                </div>
            </div>
            {activeTab === 'one' ? (
                <div className="flex w-full flex-1 flex-col">
                    <div className="w-full px-5">
                        <div className="mb-8 mt-5 flex w-full justify-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-[50px] w-[50px] rounded-full"
                            />
                        </div>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Principal ID or Account ID"
                            className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-2 text-sm text-[#EEEEEE] outline-none duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                        />
                    </div>
                    <div className="relative w-full flex-1">
                        <h2 className="font-xs px-5 pb-4 pt-3 text-[#999999]">Recent Address</h2>
                        <div className="absolute bottom-0 left-0 top-10 w-full overflow-y-auto">
                            {history_address.map((address, index) => (
                                <div
                                    key={index}
                                    onClick={() => setInputValue(address)}
                                    className="block w-full cursor-pointer break-words px-5 py-2 text-xs text-[#EEEEEE] duration-300 hover:bg-[#333333]">
                                    {address}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
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
                            value={sendValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                    setSendValue(value);
                                }
                            }}
                            className="h-[48px] min-w-[50px] border-none bg-transparent pr-3 text-right text-5xl font-bold text-white outline-none"
                            style={{ width: `${sendValue.length + 1}ch` }}
                            ref={sendRef}
                        />
                        <span className="text-5xl font-bold text-white">ICP</span>
                    </div>
                    <span className="block w-full py-2 text-center text-base text-[#999999]">$0.00</span>
                    <div className="flex items-center justify-center text-sm">
                        <span className="pr-2 text-[#999999]">Available:</span>
                        <span className="pr-3 text-[#EEEEEE]">800.12</span>
                        <span className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85">50%</span>
                        <span className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85">Max</span>
                    </div>
                    <div className="mt-7 w-full rounded-xl bg-[#181818]">
                        <div className="flex w-full justify-between border-b border-[#333333] px-3 py-4">
                            <span className="text-sm text-[#999999]">To</span>
                            <div className="flex items-center">
                                <span className="px-2 text-sm text-[#EEEEEE]">uyrhg...cqe</span>
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
            )}
            <div className="w-full p-5">
                {activeTab === 'one' ? (
                    <Button
                        className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                        isDisabled={!inputValue}
                        onPress={() => {
                            setActiveTab('two');
                        }}>
                        Next
                    </Button>
                ) : (
                    <Button
                        className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                        isDisabled={parseFloat(sendValue) <= 0}>
                        Confirm
                    </Button>
                )}
            </div>
        </div>
    );
}

export default SendPage;
