import { useRef } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { useSonnerToast } from '~hooks/toast';
import { AddWalletDrawer } from '~pages/functions/switch/components/add-wallet-drawer';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsAccountsPage() {
    const current_state = useCurrentState();

    const { setHide, goto, navigate } = useGoto();

    const { current_identity, identity_list, main_mnemonic_identity, pushIdentityByMainMnemonic, switchIdentity } =
        useIdentityKeys();

    const ref = useRef<HTMLDivElement>(null);

    const toast = useSonnerToast();

    return (
        <FusePage current_state={current_state}>
            <div ref={ref} className="relative h-full w-full overflow-hidden">
                <FusePageTransition
                    className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                    setHide={setHide}
                    header={
                        <FunctionHeader
                            title={'Manage Accounts'}
                            onBack={() => goto(-1)}
                            onClose={() => goto('/', { replace: true })}
                        />
                    }
                >
                    <div className="flex h-full w-full flex-col justify-between">
                        <div className="flex-1 overflow-y-auto px-5">
                            {(identity_list ?? []).map((identity) => (
                                <div
                                    key={identity.id}
                                    className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-4 duration-300 hover:bg-[#2B2B2B]"
                                    onClick={() => navigate(`/home/settings/accounts/${identity.id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex cursor-default items-center">
                                            <div
                                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#333333] p-2 text-2xl"
                                                onClick={(e) => {
                                                    if (current_identity !== identity.id) {
                                                        switchIdentity(identity.id).then((r) => {
                                                            if (r === undefined) return;
                                                            if (r === false) throw Error('switch identity failed');
                                                            // notice successful
                                                        });
                                                    }
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                {identity.icon}
                                            </div>
                                            <span className="pl-3 text-sm">{identity.name}</span>
                                        </div>
                                        {identity.id === current_identity && <div>CURRENT</div>}
                                        <Icon
                                            name="icon-arrow-right"
                                            className="h-3 w-3 cursor-pointer text-[#999999]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <AddWalletDrawer
                            trigger={
                                <div className="p-5">
                                    <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#FFCF13] text-lg font-semibold text-black">
                                        Add / Connect wallet
                                    </div>
                                </div>
                            }
                            container={ref.current ?? undefined}
                            onAddWalletByMainMnemonic={() => {
                                pushIdentityByMainMnemonic().then((r) => {
                                    if (r === undefined) return;
                                    if (r === false) return;
                                    // notice successful
                                    toast.success('Create Account Success');
                                });
                            }}
                            goto={goto}
                            has_main_mnemonic={!!main_mnemonic_identity}
                            import_prefix={'/home/settings/accounts/import'}
                        />
                    </div>
                </FusePageTransition>
            </div>
        </FusePage>
    );
}

export default FunctionSettingsAccountsPage;
