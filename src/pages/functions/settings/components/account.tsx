import { Button } from '@heroui/react';

import Icon from '~components/icon';

function AccountPage() {
    const wallets = [
        { id: '1', name: 'Wallet 1', img: '😄' },
        { id: '2', name: 'Wallet 2', img: '😄' },
        { id: '3', name: 'Wallet 3', img: '😄' },
    ];
    return (
        <div className="flex h-[calc(100vh-60px)] flex-col justify-between">
            <div className="flex-1 overflow-y-auto px-5">
                {wallets.map((wallet, index) => (
                    <div
                        key={index}
                        className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-4 duration-300 hover:bg-[#2B2B2B]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                                    {wallet.img}
                                </div>
                                <span className="pl-3 text-sm">{wallet.name}</span>
                            </div>
                            <Icon
                                name="icon-arrow-right"
                                className="h-[9px] w-[14px] cursor-pointer text-[#999999]"></Icon>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full p-5">
                <Button className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black">Add wallet</Button>
            </div>
        </div>
    );
}

export default AccountPage;
