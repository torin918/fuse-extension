import BigNumber from 'bignumber.js';
import { useMemo, useRef } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useTokenBalanceIcByRefreshing, useTokenInfoCurrentRead, useTokenPriceIcRead } from '~hooks/store/local';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { useSonnerToast } from '~hooks/toast';
import { cn } from '~lib/utils/cn';
import type { ShowIdentityKey } from '~types/identity';
import { match_combined_token_info } from '~types/tokens';

import { FunctionHeader } from '../components/header';
import { AddWalletDrawer } from './components/add-wallet-drawer';

const AccountItem = ({
    wallet,
    current_identity,
}: {
    wallet: ShowIdentityKey;
    current_identity: string | undefined;
}) => {
    const { switchIdentity } = useIdentityKeys();

    const current_tokens = useTokenInfoCurrentRead();

    const canisters = useMemo(() => {
        const canisters: string[] = [];
        for (const token of current_tokens) {
            match_combined_token_info(token.info, {
                ic: (ic) => canisters.push(ic.canister_id),
            });
        }
        return canisters;
    }, [current_tokens]);

    const [ic_balances] = useTokenBalanceIcByRefreshing(wallet.address.ic?.owner, canisters, 15000);
    const all_ic_prices = useTokenPriceIcRead();
    const ic_prices = useMemo<[string | undefined, string | undefined][]>(
        () =>
            canisters.map((canister_id) => {
                const price = all_ic_prices[canister_id];
                return [price?.price, price?.price_change_24h];
            }),
        [canisters, all_ic_prices],
    );

    const { usd } = useMemo(() => {
        let usd = BigNumber(0);
        let usd_now = BigNumber(0);
        let usd_24h = BigNumber(0);

        for (const token of current_tokens) {
            match_combined_token_info(token.info, {
                ic: (ic) => {
                    const index = canisters.findIndex((c) => c == ic.canister_id);
                    if (index < 0) return;
                    const balance = ic_balances[index];
                    if (!balance) return;
                    if (balance === '0') return;
                    const [price, price_changed_24h] = ic_prices[index];
                    let b: BigNumber | undefined = undefined;
                    if (price !== undefined) {
                        b = BigNumber(balance).times(BigNumber(price)).div(BigNumber(10).pow(ic.decimals));
                        usd = usd.plus(b);
                        if (price_changed_24h !== undefined) {
                            usd_now = usd_now.plus(b);
                            const old_price = BigNumber(price).div(
                                BigNumber(1).plus(BigNumber(price_changed_24h).div(BigNumber(100))),
                            );
                            const old_b = BigNumber(balance)
                                .times(BigNumber(old_price))
                                .div(BigNumber(10).pow(ic.decimals));
                            usd_24h = usd_24h.plus(old_b);
                        }
                    }
                },
            });
        }

        return {
            usd: usd.toFormat(2),
            usd_changed: usd_now.minus(usd_24h),
            usd_changed_24h: usd_24h.gt(BigNumber(0))
                ? usd_now.times(BigNumber(100)).div(usd_24h).minus(BigNumber(100))
                : BigNumber(0),
        };
    }, [canisters, ic_balances, current_tokens, ic_prices]);

    return (
        <div
            key={wallet.id}
            className={cn(
                `flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#181818] bg-[#181818] px-3 py-3 duration-300 hover:bg-[#2B2B2B]`,
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
                    {/* wallet amount */}
                    <span className="text-sm text-[#FFCF13]">${usd}</span>
                </div>
            </div>
            {wallet.id === current_identity && <Icon name="icon-ok" className="h-5 w-5 text-[#FFCF13]" />}
        </div>
    );
};

function FunctionSwitchAccountPage() {
    const toast = useSonnerToast();

    const current_state = useCurrentState();
    const { setHide, goto: _goto } = useGoto();

    const { current_identity, main_mnemonic_identity, identity_list, pushIdentityByMainMnemonic } = useIdentityKeys();

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
                                    <AccountItem key={wallet.id} wallet={wallet} current_identity={current_identity} />
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
