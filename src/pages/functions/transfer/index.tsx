import { useEffect, useMemo, useState } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useTokenInfoCurrent, useTokenInfoCustom } from '~hooks/store';
import { cn } from '~lib/utils/cn';
import { FunctionHeader } from '~pages/functions/components/header';
import {
    get_token_unique_id,
    is_same_token_info,
    match_combined_token_info,
    TokenTag,
    type TokenInfo,
} from '~types/tokens';
import { get_token_logo, PRESET_ALL_TOKEN_INFO } from '~types/tokens/preset';

import { TransferShowToken } from './components/token_item';

type Tab = 'current' | 'all' | 'ck' | 'sns' | 'custom';
const TabNames: Record<Tab, string> = {
    current: '⭐️',
    all: 'All',
    ck: 'CK',
    sns: 'SNS',
    custom: 'Custom',
};
const TABS: Tab[] = ['current', 'all', 'ck', 'sns', 'custom'];

function FunctionTransferPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto, navigate } = useGoto();

    const [tab, setTab] = useState<Tab>('current');
    const [custom] = useTokenInfoCustom();
    const [current] = useTokenInfoCurrent();

    const [search, setSearch] = useState('');

    const currentTokens = useMemo(() => current, [current]);
    const allTokens = useMemo(() => [...PRESET_ALL_TOKEN_INFO, ...custom.map((t) => t.token)], [custom]);
    const ckTokens = useMemo(() => PRESET_ALL_TOKEN_INFO.filter((t) => t.tags.includes(TokenTag.ChainIcCk)), []);
    const snsTokens = useMemo(() => PRESET_ALL_TOKEN_INFO.filter((t) => t.tags.includes(TokenTag.ChainIcSns)), []);
    const customTokens = useMemo(() => custom.map((t) => t.token), [custom]);

    const tokens = useMemo<(TokenInfo & { id: string; current: boolean })[]>(() => {
        return (() => {
            const tokens: Record<Tab, TokenInfo[]> = {
                current: currentTokens,
                all: allTokens,
                ck: ckTokens,
                sns: snsTokens,
                custom: customTokens,
            };
            return tokens[tab].map((t) => ({
                ...t,
                id: get_token_unique_id(t),
                current: !!currentTokens.find((c) => is_same_token_info(c, t)),
            }));
        })().filter((t) => {
            const s = search.trim().toLowerCase();
            if (!s) return true;
            return match_combined_token_info(t.info, {
                ic: (ic) => 0 <= ic.name.toLowerCase().indexOf(s) || 0 <= ic.symbol.toLowerCase().indexOf(s),
            });
        });
    }, [search, tab, currentTokens, allTokens, ckTokens, snsTokens, customTokens]);

    const [logo_map, setLogoMap] = useState<Record<string, string>>({});
    useEffect(() => {
        const loads = tokens.filter((t) => !logo_map[t.id]);
        if (loads.length === 0) return;
        Promise.all(
            loads.map(
                async (token): Promise<[string, string | undefined]> => [token.id, await get_token_logo(token.info)],
            ),
        ).then((items) => {
            for (const [id, icon] of items) if (icon !== undefined) logo_map[id] = icon;
            setLogoMap({ ...logo_map });
        });
    }, [tokens, logo_map]);

    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 10 }}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Select'} onBack={() => _goto('/')} onClose={() => _goto('/')} />

                    <div className="w-full px-5">
                        <div className="flex h-12 w-full items-center rounded-xl border border-[#333333] px-3 transition duration-300 hover:border-[#FFCF13]">
                            <Icon name="icon-search" className="h-[16px] w-[16px] text-[#999999]"></Icon>
                            <input
                                type="text"
                                className="h-full w-full border-transparent bg-transparent pl-3 text-base outline-none placeholder:text-sm"
                                placeholder="Search token or canister"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center px-5 py-3 text-sm">
                        {TABS.map((t) => (
                            <span
                                key={t}
                                className={cn(
                                    'cursor-pointer rounded-full px-3 py-1',
                                    tab === t ? 'bg-[#333333] text-[#EEEEEE]' : 'text-[#999999]',
                                )}
                                onClick={() => {
                                    setTab(t);
                                }}
                            >
                                {TabNames[t]}
                            </span>
                        ))}
                    </div>
                    <div className="flex w-full flex-1 flex-col gap-y-[10px] overflow-y-auto px-5 pb-5">
                        {tokens.map((token) => (
                            <TransferShowToken
                                key={get_token_unique_id(token)}
                                goto={(path, options) =>
                                    typeof path === 'number' ? navigate(path) : navigate(path, options)
                                }
                                token={token}
                            />
                        ))}
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTransferPage;
