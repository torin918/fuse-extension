import type { GotoFunction } from '~hooks/memo/goto';
import { match_combined_token_info, type TokenInfo } from '~types/tokens';

import { ShowTokenIc } from './show/token-ic';

export const HomeShowToken = ({
    goto,
    token,
    token_prices,
    ic_balances,
}: {
    goto: GotoFunction;
    token: TokenInfo;
    token_prices: Record<string, { price?: string; price_change_24h?: string }>;
    ic_balances: Record<string, string>;
}) => {
    return match_combined_token_info(token.info, {
        ic: (ic) => (
            <ShowTokenIc goto={goto} token={token} ic={ic} token_prices={token_prices} balances={ic_balances} />
        ),
        ethereum: () => <></>,
        ethereum_test_sepolia: () => <></>,
        polygon: () => <></>,
        polygon_test_amoy: () => <></>,
        bsc: () => <></>,
        bsc_test: () => <></>,
    });
};
