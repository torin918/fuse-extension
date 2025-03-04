import { isCanisterIdText } from '@choptop/haw';
import { Button, Drawer, DrawerBody, DrawerContent, Select, SelectItem, Switch, useDisclosure } from '@heroui/react';
import { useState } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useTokenInfoCurrent, useTokenInfoCustom } from '~hooks/store';
import { cn } from '~lib/utils/cn';

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

function FunctionTokenViewPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto, navigate } = useGoto();

    const [custom, { pushCustomIcToken, removeCustomToken }] = useTokenInfoCustom();
    const [current, { pushToken, removeToken, resortToken }] = useTokenInfoCurrent();

    const [search, setSearch] = useState('');

    const [tab, setTab] = useState<Tab>('current');

    const [activeTab, setActiveTab] = useState('All');
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
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center text-sm">
                            <span
                                className={cn(
                                    'cursor-pointer rounded-full px-5 py-1',
                                    activeTab === 'All' ? 'bg-[#333333] text-[#EEEEEE]' : 'text-[#999999]',
                                )}
                                onClick={() => setActiveTab('All')}
                            >
                                All
                            </span>
                            <span
                                className={cn(
                                    'cursor-pointer rounded-full px-5 py-1',
                                    activeTab === 'SNS' ? 'bg-[#333333] text-[#EEEEEE]' : 'text-[#999999]',
                                )}
                                onClick={() => setActiveTab('SNS')}
                            >
                                SNS
                            </span>
                            <span
                                className={cn(
                                    'cursor-pointer rounded-full px-5 py-1',
                                    activeTab === 'CK' ? 'bg-[#333333] text-[#EEEEEE]' : 'text-[#999999]',
                                )}
                                onClick={() => setActiveTab('CK')}
                            >
                                CK
                            </span>
                        </div>
                        <div
                            className="flex cursor-pointer items-center text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                            onClick={() => setIsOpen(true)}
                        >
                            <span className="pr-1">Custom Token</span>
                            <Icon name="icon-arrow-right" className="h-[6px] w-[11px] text-[#FFCF13]"></Icon>
                        </div>
                    </div>
                    <div className="flex w-full flex-1 flex-col gap-y-[10px] overflow-y-auto px-5 pb-5">
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICP</strong>
                                    <span className="text-xs text-[#999999]">Internet Computer</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/atbfz-diaaa-aaaaq-aacyq-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICS</strong>
                                    <span className="text-xs text-[#999999]">ICPSwap</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICP</strong>
                                    <span className="text-xs text-[#999999]">Internet Computer</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/atbfz-diaaa-aaaaq-aacyq-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICS</strong>
                                    <span className="text-xs text-[#999999]">ICPSwap</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICP</strong>
                                    <span className="text-xs text-[#999999]">Internet Computer</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/atbfz-diaaa-aaaaq-aacyq-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICS</strong>
                                    <span className="text-xs text-[#999999]">ICPSwap</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICP</strong>
                                    <span className="text-xs text-[#999999]">Internet Computer</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center">
                                <img
                                    src="https://metrics.icpex.org/images/atbfz-diaaa-aaaaq-aacyq-cai.png"
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className="ml-[10px]">
                                    <strong className="block text-base text-[#EEEEEE]">ICS</strong>
                                    <span className="text-xs text-[#999999]">ICPSwap</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-3">
                                    <Icon
                                        name="icon-sswap"
                                        className="h-[14px] w-[16px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                    ></Icon>
                                </div>
                                <div className="switch-xs">
                                    <Switch defaultSelected color="success" size="sm"></Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CustomToken isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </FusePageTransition>{' '}
        </FusePage>
    );
}

export default FunctionTokenViewPage;
