import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import type { GotoFunction } from '~hooks/memo/goto';
import { match_combined_token_info, type TokenInfo } from '~types/tokens';
import type { IcTokenInfo } from '~types/tokens/ic';
import { get_token_logo } from '~types/tokens/preset';

export const HomeShowToken = ({
    goto,
    token,
    canisters,
    ic_balances,
}: {
    goto: GotoFunction;
    token: TokenInfo;
    canisters: string[];
    ic_balances: (string | undefined)[];
}) => {
    return match_combined_token_info(token.info, {
        ic: (ic) => <ShowTokenIc goto={goto} token={token} ic={ic} canisters={canisters} balances={ic_balances} />,
    });
};

const ShowTokenIc = ({
    goto,
    token,
    ic,
    canisters,
    balances,
}: {
    goto: GotoFunction;
    token: TokenInfo;
    ic: IcTokenInfo;
    canisters: string[];
    balances: (string | undefined)[];
}) => {
    const [logo, setLogo] = useState<string>();
    useEffect(() => {
        get_token_logo(token.info).then(setLogo);
    }, [token]);

    const balance = useMemo(() => {
        const index = canisters.findIndex((c) => c == ic.canister_id);
        if (index < 0) return undefined;
        return balances[index];
    }, [ic, canisters, balances]);

    return (
        <div
            className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]"
            onClick={() => goto('/home/token/ic', { state: { canister_id: ic.canister_id } })}
        >
            <div className="flex items-center">
                <img src={logo} className="h-10 w-10 rounded-full" />
                <div className="ml-[10px]">
                    <strong className="block text-base text-[#EEEEEE]">{ic.symbol}</strong>
                    <span className="text-xs text-[#999999]">$10.97</span>
                    <span className="pl-2 text-xs text-[#00C431]">+2.8%</span>
                    <span className="pl-2 text-xs text-[#FF2C40]">-2.87%</span>
                </div>
            </div>
            <div className="flex-end flex shrink-0 flex-col">
                {balance === undefined && (
                    <strong className="block text-right text-base text-[#EEEEEE]">
                        <span className="opacity-0">--</span>
                    </strong>
                )}
                {balance !== undefined && (
                    <strong className="block text-right text-base text-[#EEEEEE]">
                        {BigNumber(balance).div(BigNumber(10).pow(ic.decimals)).toFormat(2)}
                    </strong>
                )}

                <span className="text-right text-xs text-[#999999]">$8,160.91</span>
            </div>
        </div>
    );
};
