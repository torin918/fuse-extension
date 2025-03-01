import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from '@heroui/react';
import { useState } from 'react';

export const AddAddress = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { onOpenChange } = useDisclosure();
    const [addrName, setAddrName] = useState<string>('');
    const [customAddress, setCustomAddress] = useState<string>('');
    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="w-full">
                            <div className="flex w-full items-center justify-between py-3">
                                <span className="text-sm">Add Address</span>
                                <span
                                    className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </span>
                            </div>
                            <div className="mt-5 w-full">
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
                            className="h-[48px] bg-[#FFCF13] text-lg font-semibold text-black"
                            isDisabled={!addrName || !customAddress}
                            onPress={() => setIsOpen(false)}
                        >
                            Add
                        </Button>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
