import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from '@heroui/react';
import { useState } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityKeys } from '~hooks/store/local-secure';

import { FunctionHeader } from '../../../components/header';

const AddWallet = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { onOpenChange } = useDisclosure();

    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="w-full">
                            <div className="flex w-full items-center justify-between py-3">
                                <span className="text-sm">Add / Connect wallet</span>
                                <span
                                    className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </span>
                            </div>
                            <div className="mt-5 flex w-full flex-col gap-4">
                                <div className="flex cursor-pointer items-center rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#333333]">
                                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2B2B2B]">
                                        <Icon name="icon-add" className="h-6 w-6 text-[#999]" />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="text-base text-[#EEEEEE]">Create New Account</div>
                                        <p className="text-xs text-[#999999]">Add a new multi-chain account</p>
                                    </div>
                                </div>
                                <div className="flex cursor-pointer items-center rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#333333]">
                                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2B2B2B]">
                                        <Icon name="icon-file" className="h-5 w-5 text-[#999]" />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="text-base text-[#EEEEEE]">Import Seed Phrase</div>
                                        <p className="text-xs text-[#999999]">Import accounts from another wallet</p>
                                    </div>
                                </div>
                                <div className="flex cursor-pointer items-center rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#333333]">
                                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2B2B2B]">
                                        <Icon name="icon-import" className="h-5 w-5 text-[#999]" />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="text-base text-[#EEEEEE]">Import Private Key</div>
                                        <p className="text-xs text-[#999999]">Import a single-chain account</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="h-[48px] bg-[#FFCF13] text-lg font-semibold text-black"
                            onPress={() => setIsOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

function FunctionSettingsAccountsPage() {
    const current_state = useCurrentState();

    const { setHide, goto, navigate } = useGoto();

    const {
        current_identity,
        identity_list,
        main_mnemonic_identity,
        pushIdentityByMainMnemonic,
        switchIdentity,
        resortIdentityKeys,
    } = useIdentityKeys();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Manage Accounts'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="flex h-full w-full flex-col justify-between">
                    <div className="flex-1 overflow-y-auto px-5">
                        {(identity_list ?? []).map((identity) => (
                            <div
                                key={identity.id}
                                className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-4 duration-300 hover:bg-[#2B2B2B]"
                                onClick={() => navigate(`/home/settings/accounts/${identity.id}`)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex cursor-default items-center">
                                        <div
                                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#333333] p-2 text-2xl"
                                            onClick={(e) => {
                                                if (current_identity !== identity.id) {
                                                    switchIdentity(identity.id).then((r) => {
                                                        console.error('switch identity', r);
                                                        if (r === undefined) return;
                                                        if (r === false) throw Error('switch identity failed');
                                                        // notice successful
                                                    });
                                                }
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            {identity.icon}
                                        </div>
                                        <span className="pl-3 text-sm">{identity.name}</span>
                                    </div>
                                    {identity.id === current_identity && <div>CURRENT</div>}
                                    <Icon name="icon-arrow-right" className="h-3 w-3 cursor-pointer text-[#999999]" />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* {identity_list !== undefined && 1 < identity_list.length && (
                        <div
                            onClick={() => {
                                resortIdentityKeys(1, 0).then((d) => {
                                    console.error('resort', d);
                                });
                            }}
                        >
                            resort
                        </div>
                    )}
                    {main_mnemonic_identity && (
                        <div className="w-full p-5">
                            <Button
                                className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                                onPress={() => {
                                    pushIdentityByMainMnemonic().then((r) => {
                                        if (r === undefined) return;
                                        if (r === false) return;
                                        // notice successful
                                    });
                                }}
                            >
                                Add wallet by main seed
                            </Button>
                        </div>
                    )} */}
                    <div className="w-full p-5">
                        <Button
                            className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                            onPress={() => setIsOpen(true)}
                        >
                            Add / Connect wallet
                        </Button>
                    </div>
                </div>
            </FusePageTransition>

            <AddWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        </FusePage>
    );
}

export default FunctionSettingsAccountsPage;
