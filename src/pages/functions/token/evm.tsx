import BigNumber from 'bignumber.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CiWallet } from 'react-icons/ci';
import { useInView } from 'react-intersection-observer';
import { useLocation } from 'react-router-dom';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useWalletNativeTransactionsHistory } from '~hooks/apis/evm';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useSonnerToast } from '~hooks/toast';
import { truncate_text } from '~lib/utils/text';
import { FunctionHeader } from '~pages/functions/components/header';
import type { EvmChain } from '~types/chain';
import type { TokenTransferredIcRecord } from '~types/records/token/transferred_ic';
import { match_combined_token_info, type CurrentTokenShowInfo } from '~types/tokens';
import { BscTokenStandard } from '~types/tokens/chain/bsc';
import { BscTestTokenStandard } from '~types/tokens/chain/bsc-test';
import { EthereumTokenStandard } from '~types/tokens/chain/ethereum';
import { EthereumTestSepoliaTokenStandard } from '~types/tokens/chain/ethereum-test-sepolia';
import type { IcTokenInfo } from '~types/tokens/chain/ic';
import { PolygonTokenStandard } from '~types/tokens/chain/polygon';
import { PolygonTestAmoyTokenStandard } from '~types/tokens/chain/polygon-test-amoy';
import { get_token_logo } from '~types/tokens/preset';

import { TokenMetadataEvm } from './components/token-metadata';

const TransferItem = ({
    item,
    logo,
    token,
}: {
    item: TokenTransferredIcRecord;
    logo: string | undefined;
    token: IcTokenInfo | undefined;
}) => {
    const toAccount = useMemo(() => {
        if (item.to === undefined) return '';
        if (typeof item.to === 'string') {
            return item.to;
        } else {
            return item.to.owner;
        }
    }, [item.to]);

    const amount = useMemo(() => {
        if (item.amount === undefined || token === undefined) return '';
        return new BigNumber(item.amount).dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals))).toFixed(2);
    }, [item, token]);

    const method = useMemo(() => {
        if (item.method === undefined) return '';
        if (item.method === 'icrc1_transfer' || item.method === 'transfer') {
            return 'Send';
        }
        // TODO: receive and swap check
        return 'Receive';
    }, [item.method]);

    return (
        <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
            <div className="flex items-center">
                <img
                    src={logo ?? 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png'}
                    className="h-10 w-10 rounded-full"
                />
                <div className="ml-[10px] text-left">
                    <strong className="block text-base text-[#EEEEEE]">{method}</strong>
                    <span className="text-xs text-[#999999]">To {truncate_text(toAccount)}</span>
                    {/* TODO: swap */}
                    {/* <span className="text-xs text-[#999999]">To ICS</span> */}
                </div>
            </div>

            <div className="text-base font-semibold text-[#EEEEEE]">
                -{amount} {token?.symbol}
            </div>

            {/* TODO: receive */}
            {/* <div className="text-base font-semibold text-[#00C431]">+36.98 {token.symbol}</div> */}

            {/* TODO: swap */}
            {/* <div className="flex flex-col items-end">
                <div className="text-sm text-[#999999]">-1.34 {token.symbol}</div>
                <div className="text-base font-semibold text-[#00C431]">+42,582.76 {token.symbol}</div>
            </div> */}
        </div>
    );
};

const InnerPage = ({ info }: { info: CurrentTokenShowInfo }) => {
    const { setHide, goto: _goto, navigate } = useGoto();
    const toast = useSonnerToast();
    const { token, price: token_price, balance, usd_value } = info;
    const { price, price_change_24h } = token_price;
    const [logo, setLogo] = useState<string>();
    useEffect(() => {
        get_token_logo(token.info).then(setLogo);
    }, [token]);
    const { symbol, name, chain, isNative } = match_combined_token_info<{
        symbol: string;
        name: string;
        chain: EvmChain;
        isNative: boolean;
    }>(token.info, {
        ic: () => {
            throw new Error('ic token not supported');
        },
        ethereum: (ethereum) => ({
            symbol: ethereum.symbol,
            name: ethereum.name,
            chain: 'ethereum',
            isNative: ethereum.standards.includes(EthereumTokenStandard.NATIVE),
        }),
        ethereum_test_sepolia: (ethereum_test_sepolia) => ({
            symbol: ethereum_test_sepolia.symbol,
            name: ethereum_test_sepolia.name,
            chain: 'ethereum-test-sepolia',
            isNative: ethereum_test_sepolia.standards.includes(EthereumTestSepoliaTokenStandard.NATIVE),
        }),
        polygon: (polygon) => ({
            symbol: polygon.symbol,
            name: polygon.name,
            chain: 'polygon',
            isNative: polygon.standards.includes(PolygonTokenStandard.NATIVE),
        }),
        polygon_test_amoy: (polygon_test_amoy) => ({
            symbol: polygon_test_amoy.symbol,
            name: polygon_test_amoy.name,
            chain: 'polygon-test-amoy',
            isNative: polygon_test_amoy.standards.includes(PolygonTestAmoyTokenStandard.NATIVE),
        }),
        bsc: (bsc) => ({
            symbol: bsc.symbol,
            name: bsc.name,
            chain: 'bsc',
            isNative: bsc.standards.includes(BscTokenStandard.NATIVE),
        }),
        bsc_test: (bsc_test) => ({
            symbol: bsc_test.symbol,
            name: bsc_test.name,
            chain: 'bsc-test',
            isNative: bsc_test.standards.includes(BscTestTokenStandard.NATIVE),
        }),
    });
    const ref = useRef<HTMLDivElement>(null);

    const transactionsRef = useRef<HTMLDivElement>(null);
    const { ref: loadMoreRef, inView } = useInView();
    const {
        data: transactionsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useWalletNativeTransactionsHistory({
        chain,
        limit: 10,
        enabled: isNative,
    });
    console.debug('🚀 ~ InnerPage ~ transactionsData:', transactionsData);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage]);

    return (
        <div ref={ref} className="relative h-full w-full overflow-hidden">
            <FusePageTransition
                setHide={setHide}
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                header={<FunctionHeader title={symbol || ''} onBack={() => _goto('/')} onClose={() => _goto('/')} />}
            >
                <div className="flex h-full flex-col justify-between">
                    <div className="w-full flex-1 overflow-y-auto">
                        <div className="flex w-full items-center px-5">
                            <img src={logo} className="mr-2 h-10 w-10 rounded-full" />
                            <div className="w-auto">
                                <div className="block text-sm text-[#999999]">
                                    <strong className="pr-3 text-base text-[#EEEEEE]">{name}</strong>
                                    {symbol}
                                </div>

                                <div className="m-1 block text-sm text-[#999999]">
                                    {price === undefined && (
                                        <span className="text-xs text-[#999999]">
                                            <span className="opacity-0">--</span>
                                        </span>
                                    )}
                                    {price !== undefined && (
                                        <>
                                            <span className="text-xs text-[#999999]">
                                                ${BigNumber(price).toFormat(2)}
                                            </span>
                                            {price_change_24h !== undefined && price_change_24h.startsWith('-') && (
                                                <span className="pl-2 text-xs text-[#FF2C40]">
                                                    {BigNumber(price_change_24h).toFormat(2)}%
                                                </span>
                                            )}
                                            {price_change_24h !== undefined && !price_change_24h.startsWith('-') && (
                                                <span className="pl-2 text-xs text-[#00C431]">
                                                    +{BigNumber(price_change_24h).toFormat(2)}%
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="my-4 px-5">
                            <div className="flex items-center">
                                <strong className="text-4xl text-[#FFCF13]">{balance.formatted}</strong>
                                <CiWallet className="ml-3 h-4 w-4 text-[#999999]" />
                            </div>
                            <span className="block w-full text-sm text-[#999999]">≈${usd_value?.formatted}</span>
                        </div>
                        <div className="my-2 flex w-full items-center justify-between px-5">
                            {[
                                {
                                    callback: () => navigate('/home/token/evm/transfer', { state: info }),
                                    icon: 'icon-send',
                                    name: 'Send',
                                },
                                {
                                    callback: () => navigate('/home/token/evm/receive'),
                                    icon: 'icon-receive',
                                    name: 'Receive',
                                },
                                {
                                    callback: () => {
                                        toast.info('Come soon');
                                        // navigate('/home/swap')
                                    },
                                    icon: 'icon-swap',
                                    name: 'Swap',
                                },
                                {
                                    callback: () => {
                                        transactionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    },
                                    icon: 'icon-history',
                                    name: 'History',
                                },
                            ].map(({ callback, icon, name }) => (
                                <div
                                    key={icon}
                                    onClick={callback}
                                    className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                                >
                                    <Icon
                                        name={icon}
                                        className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                                    />
                                    <span className="pt-1 text-xs text-[#EEEEEE]">{name}</span>
                                </div>
                            ))}
                        </div>

                        <TokenMetadataEvm token={token} />

                        <div ref={transactionsRef} className="mt-5 w-full pb-5">
                            <h3 className="block px-5 pb-4 text-sm text-[#999999]">Transactions</h3>
                            <div className="flex w-full flex-col">
                                {isLoading ? (
                                    Array(3)
                                        .fill(0)
                                        .map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="flex w-full items-center justify-between px-5 py-[10px]"
                                            >
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 animate-pulse rounded-full bg-[#181818]" />
                                                    <div className="ml-[10px] space-y-2">
                                                        <div className="h-4 w-20 animate-pulse rounded bg-[#181818]" />
                                                        <div className="h-3 w-32 animate-pulse rounded bg-[#181818]" />
                                                    </div>
                                                </div>
                                                <div className="h-4 w-24 animate-pulse rounded bg-[#181818]" />
                                            </div>
                                        ))
                                ) : (
                                    <>
                                        {transactionsData?.pages.map((page, pageIndex) => (
                                            <React.Fragment key={pageIndex}>
                                                {page.data.map((transaction, idx) => (
                                                    <div key={`${pageIndex}-${idx}`} className="w-full">
                                                        <div>{transaction.hash}</div>
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        ))}

                                        <div ref={loadMoreRef} className="py-4">
                                            {isFetchingNextPage && (
                                                <div className="flex justify-center">
                                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFCF13] border-t-transparent" />
                                                </div>
                                            )}
                                        </div>

                                        {!hasNextPage && transactionsData?.pages[0]?.data.length && (
                                            <div className="py-4 text-center text-sm text-[#999999]">
                                                No more transactions
                                            </div>
                                        )}

                                        {transactionsData?.pages[0]?.data.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <Icon name="icon-empty" className="h-12 w-12 text-[#999999]" />
                                                <span className="mt-2 text-sm text-[#999999]">No transactions yet</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </FusePageTransition>
        </div>
    );
};

function FunctionTokenEvmPage() {
    const current_state = useCurrentState();

    const location = useLocation();
    const info = location.state as CurrentTokenShowInfo;

    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <InnerPage info={info} />
        </FusePage>
    );
}

export default FunctionTokenEvmPage;
