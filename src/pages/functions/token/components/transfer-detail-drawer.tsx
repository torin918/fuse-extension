// Avatar, AvatarGroup,
import '@heroui/react';

import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { formatEther, formatUnits, isAddressEqual, parseEventLogs, type Address, type Hash } from 'viem';

import type { GetTransactionsHistoryItem } from '~apis/evm';
import Icon from '~components/icon';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';
import { parseTransferLogs, useTransactionDetail } from '~hooks/evm/contracts';
import { get_viem_chain_by_chain } from '~hooks/evm/viem';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import { useSonnerToast } from '~hooks/toast';
import { truncate_text } from '~lib/utils/text';
import { match_chain, type EvmChain } from '~types/chain';
import type { TokenTransferredIcRecord } from '~types/records/token/transferred_ic';
import type { IcTokenInfo } from '~types/tokens/chain/ic';

import { format_number_smart } from '../evm';

const TransferDetailDrawerIc = ({
    trigger,
    container,
    logo,
    currentDetail,
    token,
}: {
    trigger?: React.ReactNode;
    container?: HTMLElement | null;
    logo: string | undefined;
    currentDetail: TokenTransferredIcRecord;
    token: IcTokenInfo | undefined;
}) => {
    const [open, setOpen] = useState(false);
    const toast = useSonnerToast();

    const toAccount = useMemo(() => {
        if (currentDetail.to === undefined) return '';
        if (typeof currentDetail.to === 'string') {
            return currentDetail.to;
        } else {
            return currentDetail.to.owner;
        }
    }, [currentDetail.to]);

    const amount = useMemo(() => {
        if (currentDetail.amount === undefined || token === undefined) return '';
        return new BigNumber(currentDetail.amount)
            .dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals)))
            .toFixed(2);
    }, [currentDetail, token]);

    const method = useMemo(() => {
        if (currentDetail.method === undefined) return '';
        if (currentDetail.method === 'icrc1_transfer' || currentDetail.method === 'transfer') {
            return 'Send';
        }
        // TODO: receive and swap check
        return 'Receive';
    }, [currentDetail.method]);

    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerTrigger className="w-full">{trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="border-t border-[#333333] bg-[#0a0600] text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-between text-white">
                            <span className="text-sm">Transaction details</span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription />
                </DrawerHeader>
                <div className="w-full flex-1 overflow-y-auto bg-[#0a0600] px-5 pb-10">
                    <div className="flex w-full flex-col items-center justify-center pb-5">
                        <img
                            src={logo ?? 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png'}
                            className="h-[50px] w-[50px] rounded-full"
                        />
                        {/* <span className="pt-2 text-[28px] text-[#00C431]">+{amount} {token.symbol}</span> */}
                        <span className="pt-2 text-[28px]">
                            -{amount} {token?.symbol}
                        </span>
                    </div>
                    {/* {currentDetail.type === 'swap' && (
                            <div className="flex flex-col justify-center items-center w-full">
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
                        )} */}
                    <div className="w-full rounded-xl bg-[#181818]">
                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Time</span>
                            <span className="text-sm">
                                {dayjs(currentDetail.created).format('MM/DD/YYYY HH:mm:ss')}
                            </span>
                        </div>
                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Type</span>
                            <span className="text-sm">{method}</span>
                        </div>
                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Status</span>
                            <span className="text-sm text-[#00C431]">Completed</span>
                        </div>

                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">To</span>
                            <div className="flex items-center text-sm">
                                <span>{truncate_text(toAccount)}</span>
                                <CopyToClipboard text={toAccount} onCopy={() => toast.success('Copied')}>
                                    <Icon
                                        name="icon-copy"
                                        className="ml-2 h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                                    />
                                </CopyToClipboard>
                            </div>
                        </div>

                        {/* {currentDetail.type === 'swap' && (
                                    <div className="w-full">
                                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                            <span className="text-sm text-[#999999]">Provider</span>
                                            <div className="flex items-center">
                                                <img
                                                    src="https://app.icpswap.com/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png"
                                                    className="mr-2 w-5 h-5 rounded-full"
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
                                )} */}
                        {currentDetail.fee && (
                            <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                                <span className="text-sm text-[#999999]">Network Fee</span>
                                <span className="text-sm">
                                    {currentDetail.fee} {token?.symbol}
                                </span>
                            </div>
                        )}
                        <div
                            className="block w-full cursor-pointer p-3 text-center text-sm text-[#FFCF13] duration-300 hover:opacity-85"
                            onClick={() => {
                                // TODO: open in browser
                                // window.open(, '_blank')
                            }}
                        >
                            View on ICP DASHBOARD
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
const TransferDetailDrawerEvm = ({
    open,
    setOpen,
    container,
    info: { hash, chain, symbol, logo, decimals, decoded_transaction },
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    container?: HTMLElement | null;
    info: {
        hash?: Hash;
        logo: string | undefined;
        chain: EvmChain;
        symbol: string;
        decimals: number;
        decoded_transaction?: GetTransactionsHistoryItem;
    };
}) => {
    const toast = useSonnerToast();
    const { data: txDetail } = useTransactionDetail({
        chain,
        hash,
    });
    const chainInfo = get_viem_chain_by_chain(chain);
    const { current_identity } = useCurrentIdentity();
    const self = match_chain(chain, {
        ic: () => {
            throw new Error('ic token not supported');
        },
        ethereum: () => current_identity?.address.ethereum?.address,
        ethereum_test_sepolia: () => current_identity?.address.ethereum_test_sepolia?.address,
        polygon: () => current_identity?.address.polygon?.address,
        polygon_test_amoy: () => current_identity?.address.polygon_test_amoy?.address,
        bsc: () => current_identity?.address.bsc?.address,
        bsc_test: () => current_identity?.address.bsc_test?.address,
    });
    const isSent = self && decoded_transaction && isAddressEqual(decoded_transaction.from as Address, self);
    const formatted_value = decoded_transaction?.value
        ? format_number_smart(BigNumber(formatUnits(BigInt(decoded_transaction.value), decimals)))
        : '0';
    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[100vh]">
                <DrawerHeader className="border-t border-[#333333] bg-[#0a0600] text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-center text-white">
                            <div className="m-auto text-lg font-medium">Transaction details</div>
                            <div
                                className="absolute right-5 cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </div>
                        </div>
                    </DrawerTitle>
                </DrawerHeader>
                <div className="w-full flex-1 overflow-y-auto bg-[#0a0600] px-5 pb-10">
                    <div className="flex w-full flex-col items-center justify-center pb-5">
                        <img src={logo} className="h-[50px] w-[50px] rounded-full" />
                        <span className={`pt-2 text-[28px] ${isSent ? 'text-[#EEEEEE]' : 'text-[#00C431]'}`}>
                            {isSent ? '-' : '+'}
                            {formatted_value} {symbol}
                        </span>
                    </div>
                    <div className="w-full rounded-xl bg-[#181818]">
                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Status</span>
                            <span
                                className={`text-sm capitalize ${
                                    txDetail?.status === 'success'
                                        ? 'text-[#00C431]'
                                        : txDetail?.status === 'pending'
                                          ? 'text-[#FFCF13]'
                                          : 'text-[#FF2C40]'
                                }`}
                            >
                                {txDetail?.status}
                            </span>
                        </div>

                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">To</span>
                            <CopyToClipboard
                                text={decoded_transaction?.to || ''}
                                onCopy={() => {
                                    toast.success('Copied');
                                }}
                            >
                                <div className="flex items-center text-sm">
                                    <span>{truncate_text(decoded_transaction?.to || '')}</span>

                                    <Icon
                                        name="icon-copy"
                                        className="ml-2 h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                                    />
                                </div>
                            </CopyToClipboard>
                        </div>

                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">From</span>
                            <CopyToClipboard
                                text={decoded_transaction?.from || ''}
                                onCopy={() => toast.success('Copied')}
                            >
                                <div className="flex items-center text-sm">
                                    <span>{truncate_text(decoded_transaction?.from || '')}</span>
                                    <Icon
                                        name="icon-copy"
                                        className="ml-2 h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                                    />
                                </div>
                            </CopyToClipboard>
                        </div>

                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Value</span>
                            <span className="text-sm">
                                {formatted_value} {symbol}
                            </span>
                        </div>

                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Gas Fee</span>
                            <span className="text-sm">
                                {txDetail?.gasUsed && txDetail.gasPrice
                                    ? formatEther(txDetail.gasUsed * txDetail.gasPrice)
                                    : '--'}{' '}
                                {chainInfo?.nativeCurrency.symbol}
                            </span>
                        </div>

                        <div className="flex w-full items-center justify-between border-b border-[#222222] p-3">
                            <span className="text-sm text-[#999999]">Nonce</span>
                            <span className="text-sm">{txDetail?.nonce || 0}</span>
                        </div>

                        <div
                            className="block w-full cursor-pointer p-3 text-center text-sm text-[#FFCF13] duration-300 hover:opacity-85"
                            onClick={() => {
                                window.open(`${chainInfo?.blockExplorers?.default?.url}/tx/${hash}`, '_blank');
                            }}
                        >
                            View on Explorer
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
export { TransferDetailDrawerIc, TransferDetailDrawerEvm };
