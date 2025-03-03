import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionTransferPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Send'} onBack={() => _goto('/')} onClose={() => _goto('/')} />
                    <div
                        onClick={() =>
                            _goto('/home/transfer/token', { state: { token: 'ryjl3-tyaaa-aaaaa-aaaba-cai' } })
                        }
                    >
                        send icp
                    </div>
                    choose tokens
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTransferPage;
