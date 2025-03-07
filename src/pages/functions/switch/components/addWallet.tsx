import { Button } from '@heroui/react';
import { useState } from 'react';

import Icon from '~components/icon';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';
import { useGoto } from '~hooks/memo/goto';

export const AddWallet = ({
    trigger,
    container,
    onAddWallet,
}: {
    trigger: React.ReactNode;
    container?: HTMLElement | null;
    onAddWallet: () => void;
}) => {
    const [open, setOpen] = useState(false);

    const { navigate } = useGoto();

    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerTrigger>{trigger}</DrawerTrigger>
            <DrawerContent
                className="flex h-full !max-h-full w-full flex-col items-center justify-between border-0 bg-transparent pt-[50px]"
                overlayClassName="bg-black/50"
            >
                <DrawerHeader className="w-full shrink-0 border-t border-[#333333] bg-[#0a0600] px-5 pb-0 pt-1 text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm text-white">Add / Connect wallet</span>
                            <DrawerClose>
                                <span className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85">
                                    Close
                                </span>
                            </DrawerClose>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                </DrawerHeader>

                <div className="flex h-full w-full shrink flex-col justify-between bg-[#0a0600] px-5 pb-5">
                    <div className="mt-3 h-full w-full">
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
                        onPress={() => setOpen(false)}
                    >
                        Close
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
