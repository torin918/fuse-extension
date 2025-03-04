import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionTransferPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto, navigate } = useGoto();

    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 10 }}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Send'} onBack={() => _goto('/')} onClose={() => _goto('/')} />
                    <div
                        onClick={() =>
                            navigate('/home/transfer/token/ic', {
                                state: { canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai' },
                            })
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
