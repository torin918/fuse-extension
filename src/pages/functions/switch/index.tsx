import { useRef } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { useSonnerToast } from '~hooks/toast';
import { cn } from '~lib/utils/cn';
import { format_number } from '~lib/utils/number';

import { FunctionHeader } from '../components/header';
import { AddWalletDrawer } from './components/add-wallet-drawer';

function FunctionSwitchAccountPage() {
    const toast = useSonnerToast();

    const current_state = useCurrentState();
    const { setHide, goto: _goto } = useGoto();

    const { current_identity, main_mnemonic_identity, identity_list, switchIdentity, pushIdentityByMainMnemonic } =
        useIdentityKeys();

    const ref = useRef<HTMLDivElement>(null);

    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <div ref={ref} className="relative h-full w-full overflow-hidden">
                <FusePageTransition setHide={setHide}>
                    <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                        <FunctionHeader title={'Switch Wallets'} onBack={() => _goto(-1)} onClose={() => _goto('/')} />

                        <div className="flex h-full w-full flex-col justify-between">
                            <div className="flex w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 pb-5 pt-5">
                                {(identity_list ?? []).map((wallet) => (
                                    <div
                                        key={wallet.id}
                                        className={cn(
                                            `flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#181818] bg-[#181818] px-4 py-3 duration-300 hover:bg-[#2B2B2B]`,
                                            wallet.id === current_identity && 'border-[#FFCF13]',
                                        )}
                                        onClick={() => {
                                            if (current_identity !== wallet.id) {
                                                switchIdentity(wallet.id).then((r) => {
                                                    if (r === undefined) return;
                                                    if (r === false) throw Error('switch identity failed');
                                                    // notice successful
                                                });
                                            }
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                                                {wallet.icon}
                                            </div>
                                            <div className="ml-3 flex flex-col">
                                                <span className="text-base">{wallet.name}</span>
                                                {/* TODO: wallet amount */}
                                                <span className="text-sm text-[#FFCF13]">${format_number('0.00')}</span>
                                            </div>
                                        </div>
                                        {wallet.id === current_identity && (
                                            <Icon name="icon-ok" className="h-5 w-5 text-[#FFCF13]" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <AddWalletDrawer
                                trigger={
                                    <div className="p-5">
                                        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#FFCF13] text-lg font-semibold text-black">
                                            Add wallet
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
                                goto={_goto}
                                has_main_mnemonic={!!main_mnemonic_identity}
                                import_prefix={'/home/switch/account/import'}
                            />
                        </div>
                    </div>
                </FusePageTransition>
            </div>
        </FusePage>
    );
}

export default FunctionSwitchAccountPage;
