import { Avatar, AvatarGroup, Drawer, DrawerBody, DrawerContent, useDisclosure } from '@heroui/react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Icon from '~components/icon';
import { useSonnerToast } from '~hooks/toast';

const RecordDetailDrawer = ({
    isOpen,
    setIsOpen,
    currentDetail,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    currentDetail: {};
}) => {
    const { onOpenChange } = useDisclosure();
    const toast = useSonnerToast();
    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5">
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm">Details</span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                        <div className="w-full flex-1 overflow-y-auto">
                            {currentDetail.type === 'send' && (
                                <div className="flex w-full flex-col items-center justify-center">
                                    <img
                                        src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                        className="h-[50px] w-[50px] rounded-full"
                                    />
                                    <span className="pt-2 text-[28px]">-5.6 ICP</span>
                                </div>
                            )}
                            {currentDetail.type === 'receive' && (
                                <div className="flex w-full flex-col items-center justify-center">
                                    <img
                                        src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                        className="h-[50px] w-[50px] rounded-full"
                                    />
                                    <span className="pt-2 text-[28px] text-[#00C431]">+36.98 ICP</span>
                                </div>
                            )}
                            {currentDetail.type === 'swap' && (
                                <div className="flex w-full flex-col items-center justify-center">
                                    <AvatarGroup size="lg">
                                        <Avatar src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png" />
                                        <Avatar src="https://app.icpswap.com/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png" />
                                    </AvatarGroup>
                                    <div className="mt-2 flex items-center justify-center text-[28px]">
                                        <span>ICP</span>
                                        <Icon
                                            name="icon-arrow-left"
                                            className="mx-2 h-5 w-5 rotate-180 transform text-[#EEEEEE]"
                                        />
                                        <span>ICS</span>
                                    </div>
                                </div>
                            )}
                            <div className="mt-5 w-full rounded-xl bg-[#181818]">
                                <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                    <span className="text-sm text-[#999999]">Time</span>
                                    <span className="text-sm">01/16/2025 13:22:45</span>
                                </div>
                                <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                    <span className="text-sm text-[#999999]">Type</span>
                                    <span className="text-sm">{currentDetail.type}</span>
                                </div>
                                <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                    <span className="text-sm text-[#999999]">Status</span>
                                    <span className="text-sm text-[#00C431]">Completed</span>
                                </div>
                                {currentDetail.type === 'receive' && (
                                    <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                        <span className="text-sm text-[#999999]">From</span>
                                        <div className="flex items-center text-sm">
                                            <span>shg8b...32h</span>
                                            <CopyToClipboard text="" onCopy={() => toast.success('Copied')}>
                                                <Icon
                                                    name="icon-copy"
                                                    className="ml-2 h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                                                />
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                )}
                                {currentDetail.type === 'send' && (
                                    <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                        <span className="text-sm text-[#999999]">To</span>
                                        <div className="flex items-center text-sm">
                                            <span>uyrhg...cqe</span>
                                            <CopyToClipboard text="" onCopy={() => toast.success('Copied')}>
                                                <Icon
                                                    name="icon-copy"
                                                    className="ml-2 h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                                                />
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                )}
                                {currentDetail.type === 'swap' && (
                                    <div className="w-full">
                                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                            <span className="text-sm text-[#999999]">Provider</span>
                                            <div className="flex items-center">
                                                <img
                                                    src="https://app.icpswap.com/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png"
                                                    className="mr-2 h-5 w-5 rounded-full"
                                                />
                                                <span className="text-sm">ICPSwap</span>
                                            </div>
                                        </div>
                                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                            <span className="text-sm text-[#999999]">You paid</span>
                                            <span className="text-sm">-10.83 ICP</span>
                                        </div>
                                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                            <span className="text-sm text-[#999999]">You Received</span>
                                            <span className="text-sm text-[#00C431]">+293,847 ICS</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                    <span className="text-sm text-[#999999]">Network Fee</span>
                                    <span className="text-sm">0000001ICP</span>
                                </div>
                                <div className="block w-full p-3 text-center text-sm text-[#FFCF13] duration-300 hover:opacity-85">
                                    View on ICP DASHBOARD
                                </div>
                            </div>
                        </div>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default RecordDetailDrawer;
