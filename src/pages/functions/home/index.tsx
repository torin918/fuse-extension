import { Tooltip } from '@heroui/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

import ic_svg from '~assets/svg/chains/ic.min.svg';
import default_wallet from '~assets/svg/common/wallet.min.svg';
import Icon from '~components/icon';
import { showToast } from '~components/toast';
import { useIdentityKeysCount } from '~hooks/store/local-secure';
import { truncate_text } from '~lib/utils/text';
import type { MainPageState } from '~pages/functions';
import type { IdentityAddress } from '~types/identity';

function HomePage({
    setState,
    current_address,
}: {
    setState: (state: MainPageState) => void;
    current_address: IdentityAddress;
}) {
    const navigate = useNavigate();

    return (
        <div className="relative w-full">
            <div className="absolute top-0 flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333333] text-lg font-semibold text-[#999999]">
                        <img src={default_wallet} className="w-5" />
                    </div>
                    <span className="px-2 text-base text-[#EEEEEE]">Wallet 1</span>

                    <Tooltip
                        classNames={{
                            content: ['bg-[#181818]'],
                        }}
                        content={
                            <div className="flex flex-col gap-y-2 p-[10px]">
                                {current_address.ic?.owner && (
                                    <CopyToClipboard
                                        text={current_address?.ic?.owner}
                                        onCopy={() => {
                                            showToast('Copied', 'success');
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className="h-6 w-6 overflow-hidden rounded-full">
                                                <img src={ic_svg} className="h-full w-full" />
                                            </div>
                                            <div className="ml-2 flex items-center justify-between">
                                                <span className="pr-3 text-sm font-semibold text-[#eeeeee]">
                                                    Principal ID
                                                </span>
                                                <div className="flex cursor-pointer items-center text-[#999999] transition duration-300 hover:text-[#FFCF13]">
                                                    <span className="pr-2 text-sm font-normal">
                                                        {truncate_text(current_address?.ic?.owner || '')}
                                                    </span>
                                                    <Icon
                                                        name="icon-copy"
                                                        className="h-[14px] w-[14px] text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                                                    ></Icon>
                                                </div>
                                            </div>
                                        </div>
                                    </CopyToClipboard>
                                )}

                                {current_address.ic?.account_id && (
                                    <CopyToClipboard
                                        text={current_address?.ic?.account_id}
                                        onCopy={() => {
                                            showToast('Copied', 'success');
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className="h-6 w-6 overflow-hidden rounded-full">
                                                <img src={ic_svg} className="h-full w-full" />
                                            </div>
                                            <div className="ml-2 flex items-center justify-between">
                                                <span className="pr-3 text-sm font-semibold text-[#eeeeee]">
                                                    Account ID
                                                </span>
                                                <div className="flex cursor-pointer items-center text-[#999999] transition duration-300 hover:text-[#FFCF13]">
                                                    <span className="pr-2 text-sm font-normal">
                                                        {truncate_text(current_address?.ic?.account_id || '')}
                                                    </span>
                                                    <Icon
                                                        name="icon-copy"
                                                        className="h-[14px] w-[14px] text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                                                    ></Icon>
                                                </div>
                                            </div>
                                        </div>
                                    </CopyToClipboard>
                                )}
                            </div>
                        }
                        placement={'bottom-end'}
                    >
                        <div>
                            <Icon
                                name="icon-copy"
                                className="h-[14px] w-[14px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                            ></Icon>
                        </div>
                    </Tooltip>
                </div>
                <div className="flex items-center">
                    <div onClick={() => setState('search')}>
                        <Icon
                            name="icon-search"
                            className="h-[18px] w-[18px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                        ></Icon>
                    </div>
                    <div onClick={() => setState('record')}>
                        <Icon
                            name="icon-history"
                            className="mx-3 h-[18px] w-[18px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                        ></Icon>
                    </div>
                    <div onClick={() => navigate('/home/settings')}>
                        <Icon
                            name="icon-setting"
                            className="h-[18px] w-[18px] cursor-pointer text-[#EEEEEE] transition duration-300 hover:text-[#FFCF13]"
                        ></Icon>
                    </div>
                </div>
            </div>

            <div className="mt-[60px] pb-5">
                <div className="w-full py-2">
                    <div className="block text-center text-4xl font-semibold text-[#FFCF13]">$12,879.76</div>
                    <div className="mt-2 flex w-full items-center justify-center">
                        <span className="mr-2 text-sm text-[#00C431]">+$34.06</span>
                        <span className="rounded bg-[#193620] px-2 py-[2px] text-sm text-[#00C431]">+3.25%</span>
                    </div>
                </div>

                <div className="mt-2 flex w-full items-center justify-between px-5">
                    <div
                        onClick={() => setState('send')}
                        className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                    >
                        <Icon
                            name="icon-send"
                            className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                        ></Icon>
                        <span className="pt-1 text-xs text-[#EEEEEE]">Send</span>
                    </div>
                    <div
                        onClick={() => setState('receive')}
                        className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                    >
                        <Icon
                            name="icon-receive"
                            className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                        ></Icon>
                        <span className="pt-1 text-xs text-[#EEEEEE]">Receive</span>
                    </div>
                    <div
                        onClick={() => setState('swap')}
                        className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                    >
                        <Icon
                            name="icon-swap"
                            className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                        ></Icon>
                        <span className="pt-1 text-xs text-[#EEEEEE]">Swap</span>
                    </div>
                    <div
                        onClick={() => navigate('/home/dapps')}
                        className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                    >
                        <Icon
                            name="icon-dapps"
                            className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]"
                        ></Icon>
                        <span className="pt-1 text-xs text-[#EEEEEE]">Dapps</span>
                    </div>
                </div>

                <div className="mt-5 flex w-full flex-col gap-y-[10px] px-5">
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
                        <div className="shrink-0">
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
                        <div className="shrink-0">
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
                        <div className="shrink-0">
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
                        <div className="shrink-0">
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
                        <div className="shrink-0">
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
                        <div className="shrink-0">
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
