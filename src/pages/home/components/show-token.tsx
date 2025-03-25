import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';

import type { GotoFunction } from '~hooks/memo/goto';
import { match_combined_token_info, type CurrentTokenShowInfo } from '~types/tokens';
import { get_token_logo } from '~types/tokens/preset';

export const TokenCard = ({ goto, info }: { goto: GotoFunction; info: CurrentTokenShowInfo }) => {
    const { token, price, balance, usd_value } = info;
    const { price: price_value, price_change_24h } = price;
    const [logo, setLogo] = useState<string>();
    const { formatted: formatted_balance } = balance;
    const { formatted: formatted_usd_value } = usd_value;
    useEffect(() => {
        get_token_logo(token.info).then(setLogo);
    }, [token]);
    const symbol = match_combined_token_info(token.info, {
        ic: (ic) => ic.symbol,
        ethereum: (ethereum) => ethereum.symbol,
        ethereum_test_sepolia: (ethereum_test_sepolia) => ethereum_test_sepolia.symbol,
        polygon: (polygon) => polygon.symbol,
        polygon_test_amoy: (polygon_test_amoy) => polygon_test_amoy.symbol,
        bsc: (bsc) => bsc.symbol,
        bsc_test: (bsc_test) => bsc_test.symbol,
    });
    const route_key = match_combined_token_info(token.info, {
        ic: () => 'ic',
        ethereum: () => 'evm',
        ethereum_test_sepolia: () => 'evm',
        polygon: () => 'evm',
        polygon_test_amoy: () => 'evm',
        bsc: () => 'evm',
        bsc_test: () => 'evm',
    });
    return (
        <div
            className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]"
            onClick={() => goto(`/home/token/${route_key}`, { state: info })}
        >
            <div className="flex items-center">
                <img src={logo} className="h-10 w-10 rounded-full" />
                <div className="ml-[10px]">
                    <strong className="block text-base text-[#EEEEEE]">{symbol}</strong>
                    {price_value === undefined && (
                        <span className="text-xs text-[#999999]">
                            <span className="opacity-0">--</span>
                        </span>
                    )}
                    {price_value !== undefined && (
                        <>
                            <span className="text-xs text-[#999999]">${BigNumber(price_value).toFormat(2)}</span>
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
            <div className="flex-end flex shrink-0 flex-col">
                <strong className="block text-right text-base text-[#EEEEEE]">
                    {balance === undefined && <span className="opacity-0">--</span>}
                    {balance !== undefined && <>{formatted_balance}</>}
                </strong>
                <span className="text-right text-xs text-[#999999]">
                    {usd_value === undefined ? <span className="opacity-0">--</span> : <>${formatted_usd_value}</>}
                </span>
            </div>
        </div>
    );
};
