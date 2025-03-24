import BigNumber from 'bignumber.js';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ic_svg from '~assets/svg/chains/ic.min.svg';
import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { useERC20Balances } from '~hooks/evm/contracts/multicall/read';
import { useNativeBalance } from '~hooks/evm/native/read';
import { useCurrentState } from '~hooks/memo/current_state';
import { useTokenBalanceIcByRefreshing, useTokenInfoCurrentRead } from '~hooks/store/local';
import { useCurrentIdentity, useShowNetworks } from '~hooks/store/local-secure';
import { useTokenPrices } from '~hooks/store/local/memo/price';
import { useTokenPriceUsd } from '~hooks/store/local/memo/usd';
import { useSonnerToast } from '~hooks/toast';
import { truncate_text } from '~lib/utils/text';
import type { ShowIdentityKey } from '~types/identity';
import {
    get_token_unique_id,
    group_tokens_by_chain,
    match_combined_token_info,
    TokenTag,
    type CurrentTokenShowInfo,
} from '~types/tokens';
import { BscTokenStandard } from '~types/tokens/chain/bsc';
import { BscTestTokenStandard } from '~types/tokens/chain/bsc-test';
import { EthereumTokenStandard } from '~types/tokens/chain/ethereum';
import { EthereumTestSepoliaTokenStandard } from '~types/tokens/chain/ethereum-test-sepolia';
import { PolygonTokenStandard } from '~types/tokens/chain/polygon';
import { PolygonTestAmoyTokenStandard } from '~types/tokens/chain/polygon-test-amoy';

import { AddressTooltip } from './components/address-tooltip';
import SelectChain from './components/select-chain';
import { ShowSingleAddress } from './components/show-address';
import { HomeShowToken } from './components/show-token';

function HomePage() {
    const current_state = useCurrentState();
    const { current_identity } = useCurrentIdentity();

    return (
        <FusePage
            current_state={current_state}
            options={{
                update_pathname: true,
                refresh_token_price_ic_sleep: 1000 * 60,
            }}
        >
            {current_identity && <InnerHomePage current_identity={current_identity} />}
        </FusePage>
    );
}

export default HomePage;

export const useCurrentTokenssShowInfo = () => {
    const current_tokens = useTokenInfoCurrentRead();
    const { current_identity } = useCurrentIdentity();
    const [{ chains: show_networks }] = useShowNetworks();
    const show_tokens = useMemo(() => {
        return current_tokens.filter((s) => {
            const exist = show_networks.filter((t) => s.tags.includes(`chain-${t}` as TokenTag));

            if (exist.length === 0) return false;

            return true;
        });
    }, [current_tokens, show_networks]);

    // 1. group tokens by chain
    const tokens_by_chain = group_tokens_by_chain(current_tokens);

    // 2. get canisters
    const canisters = useMemo<string[]>(
        () => tokens_by_chain.ic.map((t) => t.info.ic.canister_id).filter((s) => !!s) as string[],
        [tokens_by_chain.ic],
    );
    // 3. native token balances
    const { data: ethereum_native_balance } = useNativeBalance('ethereum');
    const { data: ethereum_test_sepolia_native_balance } = useNativeBalance('ethereum-test-sepolia');
    const { data: bsc_native_balance } = useNativeBalance('bsc');
    const { data: bsc_test_native_balance } = useNativeBalance('bsc-test');
    const { data: polygon_native_balance } = useNativeBalance('polygon');
    const { data: polygon_test_amoy_native_balance } = useNativeBalance('polygon-test-amoy');
    // 3. get token balances
    const [all_ic_balances] = useTokenBalanceIcByRefreshing(current_identity?.address.ic?.owner, canisters, 15000);
    const { balances: ethereum_balances } = useERC20Balances(
        'ethereum',
        current_identity?.address.ethereum?.address,
        tokens_by_chain.ethereum.filter((t) => !t.info.ethereum.standards.includes(EthereumTokenStandard.NATIVE)),
    );
    const { balances: ethereum_test_sepolia_balances } = useERC20Balances(
        'ethereum-test-sepolia',
        current_identity?.address.ethereum_test_sepolia?.address,
        tokens_by_chain.ethereum_test_sepolia.filter(
            (t) => !t.info.ethereum_test_sepolia.standards.includes(EthereumTestSepoliaTokenStandard.NATIVE),
        ),
    );
    const { balances: bsc_balances } = useERC20Balances(
        'bsc',
        current_identity?.address.bsc?.address,
        tokens_by_chain.bsc.filter((t) => !t.info.bsc.standards.includes(BscTokenStandard.NATIVE)),
    );
    const { balances: bsc_test_balances } = useERC20Balances(
        'bsc-test',
        current_identity?.address.bsc_test?.address,
        tokens_by_chain.bsc_test.filter((t) => !t.info.bsc_test.standards.includes(BscTestTokenStandard.NATIVE)),
    );
    const { balances: polygon_balances } = useERC20Balances(
        'polygon',
        current_identity?.address.polygon?.address,
        tokens_by_chain.polygon.filter((t) => !t.info.polygon.standards.includes(PolygonTokenStandard.NATIVE)),
    );
    const { balances: polygon_test_amoy_balances } = useERC20Balances(
        'polygon-test-amoy',
        current_identity?.address.polygon_test_amoy?.address,
        tokens_by_chain.polygon_test_amoy.filter(
            (t) => !t.info.polygon_test_amoy.standards.includes(PolygonTestAmoyTokenStandard.NATIVE),
        ),
    );
    const token_prices = useTokenPrices(show_tokens, tokens_by_chain);
    const { tokens_info, all_usd, all_usd_changed, all_usd_changed_24h } = useMemo(() => {
        const tokens_info: CurrentTokenShowInfo[] = [];
        let all_usd = BigNumber(0);
        let all_usd_now = BigNumber(0);
        let all_usd_24h_ago = BigNumber(0);
        for (const token of show_tokens) {
            const unique_id = get_token_unique_id(token);
            const info = match_combined_token_info<CurrentTokenShowInfo | undefined>(token.info, {
                ic: (ic) => {
                    const balance = all_ic_balances[ic.canister_id];
                    const decimals = ic.decimals;
                    const token_price = token_prices[unique_id];
                    const { price, price_change_24h } = token_price;
                    const formatted_balance = balance
                        ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                        : undefined;
                    const usd_value = price
                        ? BigNumber(balance).times(BigNumber(price)).div(BigNumber(10).pow(decimals))
                        : undefined;
                    if (usd_value && price) {
                        all_usd = all_usd.plus(usd_value);
                        if (price_change_24h) {
                            all_usd_now = all_usd_now.plus(usd_value);
                            const old_price = BigNumber(price).div(
                                BigNumber(1).plus(BigNumber(price_change_24h).div(BigNumber(100))),
                            );
                            const old_usd_value = BigNumber(balance)
                                .times(BigNumber(old_price))
                                .div(BigNumber(10).pow(decimals));
                            all_usd_24h_ago = all_usd_24h_ago.plus(old_usd_value);
                        }
                    }

                    return {
                        token,
                        price: token_price,
                        balance: {
                            raw: balance,
                            formatted: formatted_balance,
                        },
                        usd_value: {
                            raw: usd_value?.toString(),
                            formatted: usd_value?.toFormat(2),
                        },
                    };
                },
                ethereum: (ethereum) => {
                    const is_native = ethereum.standards.includes(EthereumTokenStandard.NATIVE);
                    const balance = is_native ? ethereum_native_balance : ethereum_balances[unique_id];
                    const decimals = ethereum.decimals;
                    const token_price = token_prices[unique_id];
                    const { price, price_change_24h } = token_price;
                    const formatted_balance = balance
                        ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                        : undefined;
                    const usd_value =
                        price && balance
                            ? BigNumber(balance).times(BigNumber(price)).div(BigNumber(10).pow(decimals))
                            : undefined;
                    if (usd_value && price && balance) {
                        all_usd = all_usd.plus(usd_value);
                        if (price_change_24h) {
                            all_usd_now = all_usd_now.plus(usd_value);
                            const old_price = BigNumber(price).div(
                                BigNumber(1).plus(BigNumber(price_change_24h).div(BigNumber(100))),
                            );
                            const old_usd_value = BigNumber(balance)
                                .times(BigNumber(old_price))
                                .div(BigNumber(10).pow(decimals));
                            all_usd_24h_ago = all_usd_24h_ago.plus(old_usd_value);
                        }
                    }
                    return {
                        token,
                        price: token_prices[unique_id],
                        balance: {
                            raw: balance,
                            formatted: formatted_balance,
                        },
                        usd_value: {
                            raw: usd_value?.toString(),
                            formatted: usd_value?.toFormat(2),
                        },
                    };
                },
                ethereum_test_sepolia: (ethereum_test_sepolia) => {
                    const is_native = ethereum_test_sepolia.standards.includes(EthereumTestSepoliaTokenStandard.NATIVE);
                    const balance = is_native
                        ? ethereum_test_sepolia_native_balance
                        : ethereum_test_sepolia_balances[unique_id];
                    const decimals = ethereum_test_sepolia.decimals;
                    return {
                        token,
                        price: {
                            price: '0',
                            price_change_24h: '0',
                        },
                        balance: {
                            raw: balance,
                            formatted: balance
                                ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                                : undefined,
                        },
                        usd_value: {
                            raw: '0',
                            formatted: '0',
                        },
                    };
                },
                polygon: (polygon) => {
                    const is_native = polygon.standards.includes(PolygonTokenStandard.NATIVE);
                    const balance = is_native ? polygon_native_balance : polygon_balances[unique_id];
                    const decimals = polygon.decimals;
                    const token_price = token_prices[unique_id];
                    const { price, price_change_24h } = token_price;
                    const formatted_balance = balance
                        ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                        : undefined;
                    const usd_value =
                        price && balance
                            ? BigNumber(balance).times(BigNumber(price)).div(BigNumber(10).pow(decimals))
                            : undefined;
                    if (usd_value && price && balance) {
                        all_usd = all_usd.plus(usd_value);
                        if (price_change_24h) {
                            all_usd_now = all_usd_now.plus(usd_value);
                            const old_price = BigNumber(price).div(
                                BigNumber(1).plus(BigNumber(price_change_24h).div(BigNumber(100))),
                            );
                            const old_usd_value = BigNumber(balance)
                                .times(BigNumber(old_price))
                                .div(BigNumber(10).pow(decimals));
                            all_usd_24h_ago = all_usd_24h_ago.plus(old_usd_value);
                        }
                    }
                    return {
                        token,
                        price: token_prices[unique_id],
                        balance: {
                            raw: balance,
                            formatted: formatted_balance,
                        },
                        usd_value: {
                            raw: usd_value?.toString(),
                            formatted: usd_value?.toFormat(2),
                        },
                    };
                },
                polygon_test_amoy: (polygon_test_amoy) => {
                    const is_native = polygon_test_amoy.standards.includes(PolygonTestAmoyTokenStandard.NATIVE);
                    const balance = is_native
                        ? polygon_test_amoy_native_balance
                        : polygon_test_amoy_balances[unique_id];
                    const decimals = polygon_test_amoy.decimals;
                    const formatted_balance = balance
                        ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                        : undefined;
                    return {
                        token,
                        price: {
                            price: '0',
                            price_change_24h: '0',
                        },
                        balance: {
                            raw: balance,
                            formatted: formatted_balance,
                        },
                        usd_value: {
                            raw: '0',
                            formatted: '0',
                        },
                    };
                },
                bsc: (bsc) => {
                    const is_native = bsc.standards.includes(BscTokenStandard.NATIVE);
                    const balance = is_native ? bsc_native_balance : bsc_balances[unique_id];
                    const decimals = bsc.decimals;
                    const token_price = token_prices[unique_id];
                    const { price, price_change_24h } = token_price;
                    const formatted_balance = balance
                        ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                        : undefined;
                    const usd_value =
                        price && balance
                            ? BigNumber(balance).times(BigNumber(price)).div(BigNumber(10).pow(decimals))
                            : undefined;
                    if (usd_value && price && balance) {
                        all_usd = all_usd.plus(usd_value);
                        if (price_change_24h) {
                            all_usd_now = all_usd_now.plus(usd_value);
                            const old_price = BigNumber(price).div(
                                BigNumber(1).plus(BigNumber(price_change_24h).div(BigNumber(100))),
                            );
                            const old_usd_value = BigNumber(balance)
                                .times(BigNumber(old_price))
                                .div(BigNumber(10).pow(decimals));
                            all_usd_24h_ago = all_usd_24h_ago.plus(old_usd_value);
                        }
                    }
                    return {
                        token,
                        price: token_prices[unique_id],
                        balance: {
                            raw: balance,
                            formatted: formatted_balance,
                        },
                        usd_value: {
                            raw: usd_value?.toString(),
                            formatted: usd_value?.toFormat(2),
                        },
                    };
                },
                bsc_test: (bsc_test) => {
                    const is_native = bsc_test.standards.includes(BscTestTokenStandard.NATIVE);
                    const balance = is_native ? bsc_test_native_balance : bsc_test_balances[unique_id];
                    const decimals = bsc_test.decimals;
                    const formatted_balance = balance
                        ? BigNumber(balance).div(BigNumber(10).pow(decimals)).toFormat(2)
                        : undefined;
                    return {
                        token,
                        price: {
                            price: '0',
                            price_change_24h: '0',
                        },
                        balance: {
                            raw: balance,
                            formatted: formatted_balance,
                        },
                        usd_value: {
                            raw: '0',
                            formatted: '0',
                        },
                    };
                },
            });
            if (info !== undefined) tokens_info.push(info);
        }
        return {
            tokens_info,
            all_usd,
            all_usd_changed: all_usd_now.minus(all_usd_24h_ago),
            all_usd_changed_24h: all_usd_24h_ago.gt(BigNumber(0))
                ? all_usd_now.times(BigNumber(100)).div(all_usd_24h_ago).minus(BigNumber(100))
                : BigNumber(0),
        };
    }, [
        show_tokens,
        all_ic_balances,
        ethereum_balances,
        ethereum_test_sepolia_balances,
        bsc_balances,
        polygon_balances,
        polygon_test_amoy_balances,
        token_prices,
    ]);
    return {
        tokens_info,
        all_usd,
        all_usd_changed,
        all_usd_changed_24h,
    };
};

function InnerHomePage({ current_identity }: { current_identity: ShowIdentityKey }) {
    const toast = useSonnerToast();
    const navigate = useNavigate();

    const current_tokens = useTokenInfoCurrentRead();

    const tokens_by_chain = group_tokens_by_chain(current_tokens);
    const token_prices = useTokenPrices(current_tokens, tokens_by_chain);

    const canisters = useMemo<string[]>(
        () => tokens_by_chain.ic.map((t) => t.info.ic.canister_id).filter((s) => !!s) as string[],
        [tokens_by_chain.ic],
    );
    const [ic_balances] = useTokenBalanceIcByRefreshing(current_identity.address.ic?.owner, canisters, 15000);

    const ref = useRef<HTMLDivElement>(null);
    const { tokens_info, all_usd, all_usd_changed, all_usd_changed_24h } = useCurrentTokenssShowInfo();
    return (
        <div ref={ref} className="relative h-full w-full">
            <div className="absolute top-0 flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                <div className="flex items-center">
                    <div
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#333333] text-lg font-semibold text-[#999999]"
                        onClick={() => navigate('/home/switch/account')}
                    >
                        <div
                            style={{
                                lineHeight: '22px',
                                fontSize: '22px',
                                transform: 'translateY(1.5px)',
                            }}
                        >
                            {current_identity.icon}
                        </div>
                    </div>

                    {/** copy address  */}
                    <AddressTooltip
                        container={ref.current ?? undefined}
                        trigger={
                            <div className="flex flex-row items-center justify-center text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]">
                                <span className="cursor-pointer px-2 text-base">{current_identity.name}</span>
                                <Icon name="icon-copy" className="h-[14px] w-[14px] cursor-pointer" />
                            </div>
                        }
                        content={
                            <div className="flex flex-col gap-y-2 p-[10px]">
                                {current_identity.address.ic?.owner && (
                                    <ShowSingleAddress
                                        address={current_identity.address.ic.owner}
                                        truncated={truncate_text(current_identity.address.ic.owner)}
                                        icon={ic_svg}
                                        name="Principal ID"
                                    />
                                )}
                                {current_identity.address.ic?.account_id && (
                                    <ShowSingleAddress
                                        address={current_identity.address.ic.account_id}
                                        truncated={truncate_text(current_identity.address.ic.account_id)}
                                        icon={ic_svg}
                                        name="Account ID"
                                    />
                                )}
                            </div>
                        }
                    />
                </div>

                {/** right icons */}
                <div className="flex items-center gap-2.5">
                    {[
                        { callback: () => navigate('/home/token/view'), icon: 'icon-search' },
                        { callback: () => navigate('/home/records'), icon: 'icon-history' },
                        { callback: () => navigate('/home/settings'), icon: 'icon-setting' },
                    ].map(({ callback, icon }) => (
                        <div key={icon} onClick={callback}>
                            <Icon
                                name={icon}
                                className="h-[18px] w-[18px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    ))}
                    <SelectChain
                        trigger={
                            <div>
                                <Icon
                                    name="icon-network"
                                    className="h-[18px] w-[18px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                                />
                            </div>
                        }
                        container={ref.current ?? undefined}
                    />
                </div>
            </div>

            <div className="h-full flex-1 overflow-y-auto pb-5 pt-[60px]">
                <div className="w-full py-2">
                    <div className="block text-center text-4xl font-semibold text-[#FFCF13]">
                        ${all_usd.toFormat(2)}
                    </div>
                    <div className="mt-2 flex w-full items-center justify-center">
                        <span className="mr-2 text-sm text-[#00C431]">
                            {all_usd_changed.gt(BigNumber(0)) ? '+' : all_usd_changed.lt(BigNumber(0)) ? '-' : ''}$
                            {all_usd_changed.abs().toFormat(2)}
                        </span>
                        <span className="rounded bg-[#193620] px-2 py-[2px] text-sm text-[#00C431]">
                            {all_usd_changed_24h.gt(BigNumber(0))
                                ? '+'
                                : all_usd_changed_24h.lt(BigNumber(0))
                                  ? '-'
                                  : ''}
                            {all_usd_changed_24h.abs().toFormat(2)}%
                        </span>
                    </div>
                </div>

                <div className="mt-2 flex w-full items-center justify-between px-5">
                    {[
                        { callback: () => navigate('/home/transfer'), icon: 'icon-send', name: 'Send' },
                        { callback: () => navigate('/home/receive'), icon: 'icon-receive', name: 'Receive' },
                        {
                            callback: () => {
                                toast.info('Come soon');
                                // navigate('/home/swap')
                            },
                            icon: 'icon-swap',
                            name: 'Swap',
                        },
                        {
                            callback: () => {
                                toast.info('Come soon');
                                // navigate('/home/dapps')
                            },
                            icon: 'icon-dapps',
                            name: 'Dapps',
                        },
                    ].map(({ callback, icon, name }) => (
                        <div
                            key={icon}
                            onClick={callback}
                            className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                        >
                            <Icon
                                name={icon}
                                className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                            />
                            <span className="pt-1 text-xs text-[#EEEEEE]">{name}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex w-full flex-col gap-y-[10px] px-5">
                    {tokens_info.map((info) => (
                        <HomeShowToken
                            key={get_token_unique_id(info.token)}
                            goto={(path, options) =>
                                typeof path === 'number' ? navigate(path) : navigate(path, options)
                            }
                            info={info}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
