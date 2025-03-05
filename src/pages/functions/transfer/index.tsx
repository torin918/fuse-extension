import { useState } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { cn } from '~lib/utils/cn';
import { formatNumber } from '~lib/utils/text';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionTransferPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto, navigate } = useGoto();
    const [activeTab, setActiveTab] = useState('All');

    const tokens = [
        {
            id: 1,
            name: 'ICP',
            icon: 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png',
            price: 10.97,
            balance: 322.98,
            status: '+2.8%',
        },
        {
            id: 2,
            name: 'ICU',
            icon: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png',
            price: 0.0000001,
            balance: 23782334.87,
            status: '-18.9%',
        },
        {
            id: 1,
            name: 'ICP',
            icon: 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png',
            price: 10.97,
            balance: 322.98,
            status: '+2.8%',
        },
        {
            id: 2,
            name: 'ICU',
            icon: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png',
            price: 0.0000001,
            balance: 23782334.87,
            status: '-18.9%',
        },
        {
            id: 1,
            name: 'ICP',
            icon: 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png',
            price: 10.97,
            balance: 322.98,
            status: '+2.8%',
        },
        {
            id: 2,
            name: 'ICU',
            icon: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png',
            price: 0.0000001,
            balance: 23782334.87,
            status: '-18.9%',
        },
        {
            id: 1,
            name: 'ICP',
            icon: 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png',
            price: 10.97,
            balance: 322.98,
            status: '+2.8%',
        },
        {
            id: 2,
            name: 'ICU',
            icon: 'https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png',
            price: 0.0000001,
            balance: 23782334.87,
            status: '-18.9%',
        },
    ];

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
                            />
                        </div>
                    </div>
                    <div className="flex w-full items-center px-5 py-3 text-sm">
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
                    <div className="flex w-full flex-1 flex-col gap-y-[10px] overflow-y-auto px-5 pb-5">
                        {tokens.map((item) => (
                            <div
                                className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#181818] p-[10px] transition duration-300 hover:bg-[#2B2B2B]"
                                onClick={() =>
                                    navigate('/home/transfer/token/ic', {
                                        state: { canister_id: 'ryjl3-tyaaa-aaaaa-aaaba-cai' },
                                    })
                                }
                            >
                                <div className="flex items-center">
                                    <img src={item.icon} className="h-10 w-10 rounded-full" />
                                    <div className="ml-[10px]">
                                        <strong className="block text-base text-[#EEEEEE]">{item.name}</strong>
                                        <span className="text-xs text-[#999999]">${item.price}</span>
                                        <span
                                            className={cn(
                                                'ml-2 text-xs',
                                                item.status?.includes('+') ? 'text-[#00C431]' : 'text-[#FF2C40]',
                                            )}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-base font-semibold">{formatNumber(item.balance)}</span>
                                    <span className="ml-3 text-xs text-[#999999]">
                                        ${formatNumber(item.balance * item.price)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTransferPage;
