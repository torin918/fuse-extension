import { isCanisterIdText } from '@choptop/haw';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { Button, Drawer, DrawerBody, DrawerContent, Select, SelectItem, Switch, useDisclosure } from '@heroui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsArrowsMove } from 'react-icons/bs';
import { GrSort } from 'react-icons/gr';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useTokenInfoCurrent, useTokenInfoCustom } from '~hooks/store';
import { cn } from '~lib/utils/cn';
import { resort_list } from '~lib/utils/sort';
import {
    get_token_name,
    get_token_symbol,
    get_token_unique_id,
    is_same_token_info,
    match_combined_token_info,
    TokenTag,
    type TokenInfo,
} from '~types/tokens';
import { get_token_logo, PRESET_ALL_TOKEN_INFO } from '~types/tokens/preset';

import { FunctionHeader } from '../components/header';

const CustomToken = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { onOpenChange } = useDisclosure();

    const standards = [
        { key: 'ICRC-2', label: 'ICRC-2' },
        { key: 'ICRC-1', label: 'ICRC-1' },
        { key: 'DIP20', label: 'DIP20' },
        { key: 'DRC20', label: 'DRC20' },
    ];

    const [canisterID, setCanisterId] = useState<string>('');

    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="w-full">
                            <div className="flex w-full items-center justify-between py-3">
                                <span className="text-sm">Add Custom Token</span>
                                <span
                                    className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </span>
                            </div>
                            <div className="mt-5 w-full">
                                <div className="w-full">
                                    <label className="block py-3 text-sm">Canister ID</label>
                                    <input
                                        type="text"
                                        className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm outline-none transition duration-300 hover:border-[#FFCF13] focus:border-[#FFCF13]"
                                        placeholder="Enter canister id"
                                        onChange={(e) => setCanisterId(e.target.value)}
                                        value={canisterID}
                                    />
                                </div>
                                <div className="mt-4 w-full">
                                    <label className="block py-3 text-sm">Standard</label>
                                    <Select
                                        key="outside"
                                        classNames={{
                                            base: 'max-w-xs',
                                            trigger: 'border-[#333333] border bg-transparent h-12 hover:!bg-[#181818]',
                                        }}
                                        labelPlacement="outside"
                                        placeholder="Select  Standard"
                                    >
                                        {standards.map((s) => (
                                            <SelectItem className="bg-transparent hover:bg-[#333333]" key={s.key}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Button
                            className="h-[48px] bg-[#FFCF13] text-lg font-semibold text-black"
                            isDisabled={!isCanisterIdText(canisterID)}
                            onPress={() => setIsOpen(false)}
                        >
                            Add Token
                        </Button>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

type Tab = 'current' | 'all' | 'ck' | 'sns' | 'custom';
const TabNames: Record<Tab, string> = {
    current: '⭐️',
    all: 'All',
    ck: 'CK',
    sns: 'SNS',
    custom: 'Custom',
};
const TABS: Tab[] = ['current', 'all', 'ck', 'sns', 'custom'];

function FunctionTokenViewPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto } = useGoto();

    const [custom, { pushCustomIcToken, removeCustomToken }] = useTokenInfoCustom();
    const [current, { pushToken, removeToken, resortToken }] = useTokenInfoCurrent();

    const [search, setSearch] = useState('');

    const currentTokens = useMemo(() => current, [current]);
    const allTokens = useMemo(() => [...PRESET_ALL_TOKEN_INFO, ...custom.map((t) => t.token)], [custom]);
    const ckTokens = useMemo(() => PRESET_ALL_TOKEN_INFO.filter((t) => t.tags.includes(TokenTag.ChainIcCk)), []);
    const snsTokens = useMemo(() => PRESET_ALL_TOKEN_INFO.filter((t) => t.tags.includes(TokenTag.ChainIcSns)), []);
    const customTokens = useMemo(() => custom.map((t) => t.token), [custom]);

    const [tab, setTab] = useState<Tab>('current');

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

    const [sort, setSort] = useState(false);

    const onSwitchToken = useCallback(
        (token: TokenInfo & { current: boolean }, selected: boolean) => {
            if (token.current === selected) return;
            if (selected) pushToken(token);
            else removeToken(token);
        },
        [pushToken, removeToken],
    );

    const [wrapped, setWrapped] = useState<(TokenInfo & { id: string; current: boolean })[]>([]);
    useEffect(() => setWrapped([...tokens]), [tokens]);
    const onDragEnd = useCallback(
        (result: DropResult) => {
            const source_index = result.source.index;
            const destination_index = result.destination?.index;
            if (destination_index === undefined) return;

            if (source_index === destination_index) {
                console.error('same source_index with destination_index', source_index, destination_index);
                return;
            }
            const next = resort_list(wrapped, result.source.index, result.destination?.index);
            if (typeof next === 'object') setWrapped(next);
            resortToken(result.source.index, result.destination?.index);
        },
        [wrapped, resortToken],
    );

    // ! Switch has this problem.
    // ! Can't perform a React state update on a component that hasn't mounted yet
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Search'} onBack={() => _goto('/')} onClose={() => _goto('/')} />

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

                    <div className="flex w-full items-center justify-between px-5 py-3">
                        <div className="flex items-center text-sm">
                            {TABS.map((t) => (
                                <span
                                    key={t}
                                    className={cn(
                                        'cursor-pointer rounded-full px-3 py-1',
                                        tab === t ? 'bg-[#333333] text-[#EEEEEE]' : 'text-[#999999]',
                                    )}
                                    onClick={() => {
                                        setSort(false);
                                        setTab(t);
                                    }}
                                >
                                    {TabNames[t]}
                                </span>
                            ))}
                        </div>
                        <div
                            className="flex cursor-pointer items-center text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                            onClick={() => setIsOpen(true)}
                        >
                            {tab === 'current' ? (
                                <>
                                    <GrSort
                                        className={sort ? '' : 'text-gray-400'}
                                        onClick={() => setSort((s) => !s)}
                                    />
                                </>
                            ) : (
                                <>
                                    <span className="pr-1">Add</span>
                                    <Icon name="icon-arrow-right" className="h-[6px] w-[11px] text-[#FFCF13]" />
                                </>
                            )}
                        </div>
                    </div>

                    {mounted && (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="flex w-full flex-1 flex-col gap-y-[10px] overflow-y-auto px-5 pb-5"
                                    >
                                        {wrapped.map((token, index) => (
                                            <Draggable
                                                key={token.id}
                                                draggableId={token.id}
                                                index={index}
                                                isDragDisabled={tab !== 'current' || !sort}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="h-auto w-full"
                                                    >
                                                        <ShowTokenItem
                                                            tab={tab}
                                                            sort={sort}
                                                            token={token}
                                                            onSwitchToken={onSwitchToken}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}

                    {/* <CustomToken isOpen={isOpen} setIsOpen={setIsOpen} /> */}
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTokenViewPage;

const ShowTokenItem = ({
    tab,
    sort,
    token,
    onSwitchToken,
}: {
    tab: Tab;
    sort: boolean;
    token: TokenInfo & { id: string; current: boolean };
    onSwitchToken: (token: TokenInfo & { current: boolean }, selected: boolean) => void;
}) => {
    return (
        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
            <div className="flex items-center">
                <img src={get_token_logo(token.info)} className="h-10 w-10 rounded-full" />
                <div className="ml-[10px]">
                    <strong className="block text-base text-[#EEEEEE]">{get_token_symbol(token)}</strong>
                    <span className="text-xs text-[#999999]"> {get_token_name(token)}</span>
                </div>
            </div>
            <div className="flex items-center">
                {tab === 'current' && sort ? (
                    <>
                        <BsArrowsMove size={16} className="mr-2" />
                    </>
                ) : (
                    <>
                        {/* <div className="mr-3">
                            <Icon
                                name="icon-sswap"
                                className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                            ></Icon>
                        </div> */}
                        <div className="scale-[0.6]">
                            <Switch
                                isSelected={token.current}
                                onValueChange={(s) => onSwitchToken(token, s)}
                                color="success"
                                size="sm"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
