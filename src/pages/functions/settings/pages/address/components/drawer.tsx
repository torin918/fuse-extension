import { Button } from '@heroui/react';
import { useState } from 'react';

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';

export const AddAddressDrawer = ({
    trigger,
    container,
}: {
    trigger: React.ReactNode;
    container?: HTMLElement | null;
}) => {
    const [open, setOpen] = useState(false);
    const [addrName, setAddrName] = useState<string>('');
    const [customAddress, setCustomAddress] = useState<string>('');
    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="border-t border-[#333333] bg-[#0a0600] text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-between py-3 text-white">
                            <span className="text-sm">Add Address</span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex h-full w-full flex-col justify-between bg-[#0a0600] px-5 pb-5">
                    <div className="w-full">
                        <div className="mb-10 w-full">
                            <div className="w-full">
                                <label className="block py-3 text-sm">Name</label>
                                <input
                                    type="text"
                                    className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm outline-none transition duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                                    placeholder="Enter a name under 20 characters"
                                    onChange={(e) => setAddrName(e.target.value)}
                                    value={addrName}
                                />
                            </div>
                            <div className="mt-3 w-full">
                                <label className="block py-3 text-sm">Address</label>
                                <textarea
                                    className="w-full resize-none rounded-xl border border-[#333333] bg-transparent px-3 py-3 text-sm outline-none transition duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                                    placeholder="Enter Principal ID or Account ID"
                                    onChange={(e) => setCustomAddress(e.target.value)}
                                    value={customAddress}
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        className="h-[48px] rounded-xl bg-[#FFCF13] text-lg font-semibold text-black"
                        isDisabled={!addrName || !customAddress}
                        onPress={() => setOpen(false)}
                    >
                        Add
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
