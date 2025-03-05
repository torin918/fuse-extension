import { isCanisterIdText } from '@choptop/haw';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { FunctionHeader } from '~pages/functions/components/header';

import FunctionTransferTokenIcAddressPage from './address';
import FunctionTransferTokenIcAmountPage from './amount';

type PageState = 'address' | 'amount';

function FunctionTransferTokenIcPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();

    const location = useLocation();
    const [canister_id, setCanisterId] = useState<string>();

    useEffect(() => {
        const canister_id = location.state.canister_id;
        if (!canister_id || !isCanisterIdText(canister_id)) return _goto('/', { replace: true });
        setCanisterId(canister_id);
    }, [_goto, location]);

    const [state, setState] = useState<PageState>('address');

    const [to, setTo] = useState<string>('');

    if (!canister_id) return <></>;
    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Send'} onBack={() => _goto(-1)} onClose={() => _goto('/')} />

                    {state === 'address' && (
                        <FunctionTransferTokenIcAddressPage
                            onNext={(to: string) => {
                                setTo(to);
                                setState('amount');
                            }}
                        />
                    )}
                    {state === 'amount' && (
                        <FunctionTransferTokenIcAmountPage canister_id={canister_id} to={to} goto={_goto} />
                    )}
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTransferTokenIcPage;
