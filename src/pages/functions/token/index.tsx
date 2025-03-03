import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionTokenPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();

    const location = useLocation();
    const [token, setToken] = useState<string>();

    useEffect(() => {
        const token = location.state.token;
        if (!token) return _goto(-1);
        setToken(token);
    }, [_goto, location]);

    if (!token) return <></>;
    return (
        <FusePage current_state={current_state}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Token xxx'} onBack={() => _goto('/')} onClose={() => _goto('/')} />
                    <div onClick={() => _goto('/home/token/transfer', { state: { token } })}>send icp</div>
                    choose tokens
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTokenPage;
