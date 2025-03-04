import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionTokenIcPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();

    const location = useLocation();
    const [canister_id, setCanisterId] = useState<string>();

    useEffect(() => {
        const canister_id = location.state.canister_id;
        if (!canister_id) return _goto(-1);
        setCanisterId(canister_id);
    }, [_goto, location]);

    if (!canister_id) return <></>;
    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Token xxx'} onBack={() => _goto('/')} onClose={() => _goto('/')} />
                    <div onClick={() => _goto('/home/token/ic/transfer', { state: { canister_id } })}>send icp</div>
                    choose tokens
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTokenIcPage;
