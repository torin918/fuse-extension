import { Avatar, AvatarGroup, useDisclosure } from '@heroui/react';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'sonner';

import Icon from '~components/icon';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '~components/ui/drawer';
import type { FuseRecord } from '~types/records';
import type { ApprovedIcRecord } from '~types/records/approved/approved_ic';
import type { ConnectedRecord } from '~types/records/connected';
import type { TokenTransferredIcRecord } from '~types/records/token/transferred_ic';

const RecordDetailConnected = ({ value }: { value: ConnectedRecord }) => {
    return (
        <>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">title</span>
                <span className="flex items-center text-sm">
                    {value?.favicon ? (
                        <img src={value.favicon} className="mr-1 h-[18px] w-[18px] rounded-full" />
                    ) : (
                        <Icon name="icon-web" className="mr-1 h-[18px] w-[18px] rounded-full"></Icon>
                    )}
                    <p className="max-w-[220px] truncate">{value.title}</p>
                </span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Chain</span>
                <span className="text-sm">{value.chain}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Origin</span>
                <span className="max-w-[220px] truncate text-sm">{value.origin}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Created Time</span>
                <span className="text-sm">{dayjs(value.created).format('MM/DD/YYYY HH:mm:ss')}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Type</span>
                <span className="text-sm">{value.type}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">State</span>
                <span className="text-sm">
                    {typeof value.state === 'string' ? value.state : Object.keys(value.state)}
                </span>
            </div>
        </>
    );
};

const RecordDetailApproved = ({ value }: { value: ApprovedIcRecord }) => {
    return (
        <>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Type</span>
                <span className="text-sm">{value.type}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Chain</span>
                <span className="text-sm">{value.chain}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Canister id</span>
                <span className="flex items-center text-sm">
                    {value.canister_id}
                    <CopyToClipboard text={value.canister_id} onCopy={() => toast.success('Copied')}>
                        <div>
                            <Icon
                                name="icon-copy"
                                className="ml-2 h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    </CopyToClipboard>
                </span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Method</span>
                <span className="text-sm">{value.method}</span>
            </div>
            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                <span className="text-sm text-[#999999]">Created Time</span>
                <span className="text-sm">{dayjs(value.created).format('MM/DD/YYYY HH:mm:ss')}</span>
            </div>
        </>
    );
};

const RecordDetailTransferred = ({ value }: { value: TokenTransferredIcRecord }) => {
    console.log('🚀 ~ RecordDetailTransferred ~ value:', value);
    return <></>;
};

const RecordDetailDrawer = ({
    container,
    setIsOpen,
    currentDetail,
}: {
    container?: HTMLElement | null;
    setIsOpen: (isOpen: undefined) => void;
    currentDetail: FuseRecord;
}) => {
    const { onOpenChange } = useDisclosure();

    const key = Object.keys(currentDetail)[0] as 'connected' | 'token_transferred_ic' | 'approved_ic';
    const value = Object.values(currentDetail)[0] as ConnectedRecord | TokenTransferredIcRecord | ApprovedIcRecord;
    console.log('🚀 ~ value:', value);

    return (
        <Drawer open={!!currentDetail} onOpenChange={onOpenChange} container={container}>
            <DrawerContent
                className="flex h-full !max-h-full w-full flex-col items-center justify-between border-0 bg-transparent pt-[50px]"
                overlayClassName="bg-black/50"
            >
                <DrawerHeader className="w-full shrink-0 border-t border-[#333333] bg-[#0a0600] px-5 pb-0 pt-1 text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm text-white">
                                {key === 'connected' && 'Connected'}
                                {key === 'token_transferred_ic' && 'Transferred'}
                                {key === 'approved_ic' && 'Approved'}
                            </span>
                            <DrawerClose>
                                <span
                                    onClick={() => setIsOpen(undefined)}
                                    className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                >
                                    Close
                                </span>
                            </DrawerClose>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription className="hidden" />
                </DrawerHeader>

                <div className="flex h-full w-full flex-col bg-[#0a0600] px-5 pb-5">
                    {key === 'connected' && value && <RecordDetailConnected value={value as ConnectedRecord} />}

                    {key === 'approved_ic' && value && <RecordDetailApproved value={value as ApprovedIcRecord} />}

                    {key === 'token_transferred_ic' && value && (
                        <RecordDetailTransferred value={value as TokenTransferredIcRecord} />
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default RecordDetailDrawer;
