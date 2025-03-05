import { Button } from '@heroui/react';

import Icon from '~components/icon';
import { formatNumber } from '~lib/utils/text';
import type { MainPageState } from '~pages/functions';

// test
const wallets = [
    { id: 1, name: 'Wallet1', avatar: '😄', amount: '28374', isCurrent: true },
    { id: 2, name: 'Wallet2', avatar: '🦆', amount: '288263', isCurrent: false },
    { id: 3, name: 'Wallet3', avatar: '😌', amount: '17264', isCurrent: false },
];

function SwitchWalletPage({ setState }: { setState: (state: MainPageState) => void }) {
    return (
        <div className="flex h-full w-full flex-col justify-between">
            <div className="flex h-[60px] w-full items-center justify-between bg-[#0a0600] px-5">
                <div onClick={() => setState('home')}>
                    <Icon
                        name="icon-arrow-left"
                        className="h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                </div>
                <div className="text-lg">Switch wallets</div>
                <div className="w-[14px]"></div>
            </div>

            <div className="flex w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 pb-5 pt-5">
                {wallets.map((wallet) => (
                    <div
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#2B2B2B] ${wallet.isCurrent ? 'border border-[#FFCF13]' : ''}`}
                    >
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                                {wallet.avatar}
                            </div>
                            <div className="ml-3 flex flex-col">
                                <span className="text-base">{wallet.name}</span>
                                <span className="text-sm text-[#FFCF13]">${formatNumber(wallet.amount)}</span>
                            </div>
                        </div>
                        {wallet.isCurrent && <Icon name="icon-ok" className="h-5 w-5 text-[#FFCF13]" />}
                    </div>
                ))}
            </div>
            <div className="p-5">
                <Button
                    className="h-12 w-full bg-[#FFCF13] text-lg font-semibold text-black"
                    onPress={() => navigate(extra ? '/home/settings/accounts/extra/create' : '/initial/create')}
                >
                    Add wallet
                </Button>
            </div>
        </div>
    );
}

export default SwitchWalletPage;
