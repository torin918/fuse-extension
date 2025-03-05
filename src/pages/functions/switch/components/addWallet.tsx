import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from '@heroui/react';

import Icon from '~components/icon';
import { useGoto } from '~hooks/memo/goto';

export const AddWallet = ({
    isOpen,
    setIsOpen,
    onAddWallet,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onAddWallet: () => void;
}) => {
    const { onOpenChange } = useDisclosure();
    const { navigate } = useGoto();

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
                                <div
                                    className="flex cursor-pointer items-center rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#333333]"
                                    onClick={() => onAddWallet()}
                                >
                                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2B2B2B]">
                                        <Icon name="icon-add" className="h-6 w-6 text-[#999]" />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="text-base text-[#EEEEEE]">Create New Account</div>
                                        <p className="text-xs text-[#999999]">Add a new multi-chain account</p>
                                    </div>
                                </div>
                                <div
                                    className="flex cursor-pointer items-center rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#333333]"
                                    onClick={() => navigate(`/home/settings/accounts/import/mnemonic`)}
                                >
                                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#2B2B2B]">
                                        <Icon name="icon-file" className="h-5 w-5 text-[#999]" />
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div className="text-base text-[#EEEEEE]">Import Seed Phrase</div>
                                        <p className="text-xs text-[#999999]">Import accounts from another wallet</p>
                                    </div>
                                </div>
                                <div
                                    className="flex cursor-pointer items-center rounded-xl bg-[#181818] px-4 py-3 duration-300 hover:bg-[#333333]"
                                    onClick={() => navigate(`/home/settings/accounts/import/private_key`)}
                                >
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
