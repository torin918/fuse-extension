import { Button } from '@heroui/react';
import { useState } from 'react';

import Icon from '~components/icon';
import { showToast } from '~components/toast';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { cn } from '~lib/utils/cn';
import { formatNumber } from '~lib/utils/text';
import type { MainPageState } from '~pages/functions';

import { AddWallet } from './components/addWallet';

function SwitchWalletPage({ setState }: { setState: (state: MainPageState) => void }) {
    const { navigate } = useGoto();

    const { current_identity, identity_list, switchIdentity, pushIdentityByMainMnemonic } = useIdentityKeys();
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
                {(identity_list ?? []).map((wallet) => (
                    <div
                        key={wallet.id}
                        className={cn(
                            `flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#181818] bg-[#181818] px-4 py-3 duration-300 hover:bg-[#2B2B2B]`,
                            wallet.id === current_identity && 'border-[#FFCF13]',
                        )}
                        onClick={() => {
                            if (current_identity !== wallet.id) {
                                switchIdentity(wallet.id).then((r) => {
                                    console.error('switch identity', r);
                                    if (r === undefined) return;
                                    if (r === false) throw Error('switch identity failed');
                                    // notice successful
                                });
                            }
                        }}
                    >
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                                {wallet.icon}
                            </div>
                            <div className="ml-3 flex flex-col">
                                <span className="text-base">{wallet.name}</span>
                                {/* TODO: wallet amount */}
                                <span className="text-sm text-[#FFCF13]">${formatNumber('0.00')}</span>
                            </div>
                        </div>
                        {wallet.id === current_identity && <Icon name="icon-ok" className="h-5 w-5 text-[#FFCF13]" />}
                    </div>
                ))}
            </div>
            <div className="p-5">
                <Button
                    className="h-12 w-full bg-[#FFCF13] text-lg font-semibold text-black"
                    onPress={() => setIsOpen(true)}
                >
                    Add wallet
                </Button>
            </div>

            <AddWallet
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onAddWallet={() => {
                    pushIdentityByMainMnemonic().then((r) => {
                        if (r === undefined) return;
                        if (r === false) return;
                        // notice successful
                        showToast('Create Account Success', 'success');
                        setIsOpen(false);
                        navigate(-1); // back 1 pages
                    });
                }}
            />
        </div>
    );
}

export default SwitchWalletPage;
