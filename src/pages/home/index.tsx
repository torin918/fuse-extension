import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ic_svg from '~assets/svg/chains/ic.min.svg';
import Icon from '~components/icon';
import { truncate_text } from '~lib/utils/text';
import type { MainPageState } from '~pages/functions';
import type { ShowIdentityKey } from '~types/identity';

import { AddressTooltip } from './components/address-tooltip';
import { ShowSingleAddress } from './components/show-address';

function HomePage({
    setState,
    current_identity,
}: {
    setState: (state: MainPageState) => void;
    current_identity: ShowIdentityKey;
}) {
    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement>(null);
    return (
        <div ref={ref} className="relative h-full w-full">
            <div className="absolute top-0 flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                <div className="flex items-center">
                    <div
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#333333] text-lg font-semibold text-[#999999]"
                        onClick={() => setState('switch')}
                    >
                        <div
                            style={{
                                lineHeight: '30px',
                                fontSize: '30px',
                            }}
                        >
                            {current_identity.icon}
                        </div>
                    </div>

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
                <div className="flex items-center gap-3">
                    {[
                        { callback: () => navigate('/home/token/view'), icon: 'icon-search' },
                        { callback: () => setState('record'), icon: 'icon-history' },
                        { callback: () => navigate('/home/settings'), icon: 'icon-setting' },
                    ].map(({ callback, icon }) => (
                        <div key={icon} onClick={callback}>
                            <Icon
                                name={icon}
                                className="h-[18px] w-[18px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-full flex-1 overflow-y-auto pb-5 pt-[60px]">
                <div className="w-full py-2">
                    <div className="block text-center text-4xl font-semibold text-[#FFCF13]">$12,879.76</div>
                    <div className="mt-2 flex w-full items-center justify-center">
                        <span className="mr-2 text-sm text-[#00C431]">+$34.06</span>
                        <span className="rounded bg-[#193620] px-2 py-[2px] text-sm text-[#00C431]">+3.25%</span>
                    </div>
                </div>

                <div className="mt-2 flex w-full items-center justify-between px-5">
                    {[
                        { callback: () => navigate('/home/transfer'), icon: 'icon-send', name: 'Send' },
                        { callback: () => navigate('/home/receive'), icon: 'icon-receive', name: 'Receive' },
                        { callback: () => navigate('/home/swap'), icon: 'icon-swap', name: 'Swap' },
                        { callback: () => navigate('/home/dapps'), icon: 'icon-dapps', name: 'Dapps' },
                    ].map(({ callback, icon, name }) => (
                        <div
                            key={icon}
                            onClick={callback}
                            className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                        >
                            <Icon
                                name={icon}
                                className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                            ></Icon>
                            <span className="pt-1 text-xs text-[#EEEEEE]">{name}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex w-full flex-col gap-y-[10px] px-5">
                    <div
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]"
                        onClick={() =>
                            navigate('/home/token/ic', { state: { canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai' } })
                        }
                    >
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">ICP</strong>
                                <span className="text-xs text-[#999999]">$10.97</span>
                                <span className="pl-2 text-xs text-[#00C431]">+2.8%</span>
                            </div>
                        </div>
                        <div className="flex-end flex shrink-0 flex-col">
                            <strong className="block text-right text-base text-[#EEEEEE]">800.12</strong>
                            <span className="text-right text-xs text-[#999999]">$8,160.91</span>
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
                                <span className="text-xs text-[#999999]">$0.00013048</span>
                                <span className="pl-2 text-xs text-[#FF2C40]">-2.87%</span>
                            </div>
                        </div>
                        <div className="flex-end flex shrink-0 flex-col">
                            <strong className="block text-right text-base text-[#EEEEEE]">9,237,834</strong>
                            <span className="text-right text-xs text-[#999999]">$1,205.35</span>
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
                                <span className="text-xs text-[#999999]">$10.97</span>
                                <span className="pl-2 text-xs text-[#00C431]">+2.8%</span>
                            </div>
                        </div>
                        <div className="flex-end flex shrink-0 flex-col">
                            <strong className="block text-right text-base text-[#EEEEEE]">800.12</strong>
                            <span className="text-right text-xs text-[#999999]">$8,160.91</span>
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
                                <span className="text-xs text-[#999999]">$0.00013048</span>
                                <span className="pl-2 text-xs text-[#FF2C40]">-2.87%</span>
                            </div>
                        </div>
                        <div className="flex-end flex shrink-0 flex-col">
                            <strong className="block text-right text-base text-[#EEEEEE]">9,237,834</strong>
                            <span className="text-right text-xs text-[#999999]">$1,205.35</span>
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
                                <span className="text-xs text-[#999999]">$10.97</span>
                                <span className="pl-2 text-xs text-[#00C431]">+2.8%</span>
                            </div>
                        </div>
                        <div className="flex-end flex shrink-0 flex-col">
                            <strong className="block text-right text-base text-[#EEEEEE]">800.12</strong>
                            <span className="text-right text-xs text-[#999999]">$8,160.91</span>
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
                                <span className="text-xs text-[#999999]">$0.00013048</span>
                                <span className="pl-2 text-xs text-[#FF2C40]">-2.87%</span>
                            </div>
                        </div>
                        <div className="flex-end flex shrink-0 flex-col">
                            <strong className="block text-right text-base text-[#EEEEEE]">9,237,834</strong>
                            <span className="text-right text-xs text-[#999999]">$1,205.35</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
