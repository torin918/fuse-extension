import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CiWallet } from 'react-icons/ci';
import { useLocation } from 'react-router-dom';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useSonnerToast } from '~hooks/toast';
import { truncate_text } from '~lib/utils/text';
import { FunctionHeader } from '~pages/functions/components/header';
import type { TokenTransferredIcRecord } from '~types/records/token/transferred_ic';
import { match_combined_token_info, type CurrentTokenShowInfo } from '~types/tokens';
import type { IcTokenInfo } from '~types/tokens/chain/ic';
import { get_token_logo } from '~types/tokens/preset';

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
    const { symbol, name } = match_combined_token_info(token.info, {
        ic: () => {
            throw new Error('ic token not supported');
        },
        ethereum: (ethereum) => ({
            symbol: ethereum.symbol,
            name: ethereum.name,
        }),
        ethereum_test_sepolia: (ethereum_test_sepolia) => ({
            symbol: ethereum_test_sepolia.symbol,
            name: ethereum_test_sepolia.name,
        }),
        polygon: (polygon) => ({
            symbol: polygon.symbol,
            name: polygon.name,
        }),
        polygon_test_amoy: (polygon_test_amoy) => ({
            symbol: polygon_test_amoy.symbol,
            name: polygon_test_amoy.name,
        }),
        bsc: (bsc) => ({
            symbol: bsc.symbol,
            name: bsc.name,
        }),
        bsc_test: (bsc_test) => ({
            symbol: bsc_test.symbol,
            name: bsc_test.name,
        }),
    });
    const ref = useRef<HTMLDivElement>(null);

    const transactionsRef = useRef<HTMLDivElement>(null);

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

                        {/* <TokenMetadata canister_id={canister_id} /> */}

                        <div ref={transactionsRef} className="mt-5 w-full pb-5">
                            <h3 className="block px-5 pb-4 text-sm text-[#999999]">Transactions</h3>
                            <div className="flex w-full flex-col">
                                {/* {Object.entries(token_transferred_ic_list).map(([date, records]) => (
                                    <div className="w-full" key={`transfer_${date}`}>
                                        <div className="px-5 py-[5px] text-xs text-[#999999]">{date}</div>
                                        {records &&
                                            records.map((record, idx) => {
                                                return (
                                                    <div className="w-full" key={`transfer_item_${idx}`}>
                                                        <TransferDetailDrawer
                                                            trigger={
                                                                <TransferItem item={record} logo={logo} token={token} />
                                                            }
                                                            currentDetail={record}
                                                            token={token}
                                                            logo={logo}
                                                            container={ref.current ?? undefined}
                                                        />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ))} */}
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
