import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useTokenInfoCustom } from '~hooks/store/local';
import { MILLISECOND, MINUTE } from '~lib/utils/datetime';
import { FunctionHeader } from '~pages/functions/components/header';
import type { EvmChain } from '~types/chain';
import { match_combined_token_info } from '~types/tokens';
import { get_token_logo, PRESET_ALL_TOKEN_INFO } from '~types/tokens/preset';

import FunctionTransferTokenEvmAddressPage from './address';
import FunctionTransferTokenEvmAmountPage from './amount';

type PageState = 'address' | 'amount';

function FunctionTransferTokenEvmPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();
    const [custom] = useTokenInfoCustom();

    const allTokens = useMemo(() => [...PRESET_ALL_TOKEN_INFO, ...custom.map((t) => t.token)], [custom]);
    const location = useLocation();
    const [address, setAddress] = useState<string>();
    const [chain, setChain] = useState<EvmChain>();

    useEffect(() => {
        const address = location.state.address;
        const chain = location.state.chain;

        console.log('chain', chain, address);
        if (!address || !chain) return _goto('/', { replace: true });

        setAddress(address);
        setChain(chain);
    }, [_goto, location]);

    const [state, setState] = useState<PageState>('address');

    const [to, setTo] = useState<string>('');
    const [logo, setLogo] = useState<string>();

    useEffect(() => {
        if (!address || !chain) return;

        const token = allTokens.find(
            (t) =>
                chain in t.info &&
                match_combined_token_info(t.info, {
                    ic: () => false,
                    ethereum: (eth) => eth.address === address,
                    ethereum_test_sepolia: (eth) => eth.address === address,
                    polygon: (pol) => pol.address === address,
                    polygon_test_amoy: (pol) => pol.address === address,
                    bsc: (bsc) => bsc.address === address,
                    bsc_test: (bsc) => bsc.address === address,
                }),
        );

        if (!token) throw new Error('Unknown token info');

        get_token_logo(token.info).then(setLogo);
    }, [allTokens, address, chain]);

    if (!address || !chain) return <></>;
    return (
        <FusePage
            current_state={current_state}
            options={{ refresh_token_info_ic_sleep: MINUTE * 5, refresh_token_price_ic_sleep: MILLISECOND * 15 }}
        >
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start overflow-hidden pt-[52px]">
                    <FunctionHeader
                        title={'Send'}
                        onBack={() => (state === 'amount' ? setState('address') : _goto(-1))}
                        onClose={() => _goto('/')}
                    />

                    {state === 'address' && (
                        <FunctionTransferTokenEvmAddressPage
                            logo={logo}
                            chain={chain}
                            onNext={(to: string) => {
                                setTo(to);
                                setState('amount');
                            }}
                        />
                    )}
                    {state === 'amount' && (
                        <FunctionTransferTokenEvmAmountPage
                            logo={logo}
                            chain={chain}
                            address={address}
                            to={to}
                            goto={_goto}
                        />
                    )}
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTransferTokenEvmPage;
