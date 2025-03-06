import { useEffect, useState } from 'react';

import type { GotoFunction } from '~hooks/memo/goto';
import { match_combined_token_info, type TokenInfo } from '~types/tokens';
import type { IcTokenInfo } from '~types/tokens/ic';
import { get_token_logo } from '~types/tokens/preset';

export const TransferShowToken = ({ goto, token }: { goto: GotoFunction; token: TokenInfo }) => {
    return match_combined_token_info(token.info, {
        ic: (ic) => <TransferShowTokenIc goto={goto} token={token} ic={ic} />,
    });
};

const TransferShowTokenIc = ({ goto, token, ic }: { goto: GotoFunction; token: TokenInfo; ic: IcTokenInfo }) => {
    const [logo, setLogo] = useState<string>();
    useEffect(() => {
        get_token_logo(token.info).then(setLogo);
    }, [token]);
    return (
        <div
            className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]"
            onClick={() => goto('/home/transfer/token/ic', { state: { canister_id: ic.canister_id } })}
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
                <strong className="block text-right text-base text-[#EEEEEE]">800.12</strong>
                <span className="text-right text-xs text-[#999999]">$8,160.91</span>
            </div>
        </div>
    );
};
