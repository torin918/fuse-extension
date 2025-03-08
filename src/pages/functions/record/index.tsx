import { useState } from 'react';

import logo_icp from '~assets/svg/chains/ic.min.svg';
import Icon from '~components/icon';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import { useFuseRecordList } from '~hooks/store/local/memo/record';
import type { MainPageState } from '~pages/functions';

import ShowHistory from '../components/historydetail';

function RecordPage({ setState }: { setState: (state: MainPageState) => void }) {
    const { current_identity_network } = useCurrentIdentity();
    const [list, { done, load }] = useFuseRecordList(current_identity_network);
    console.debug(`🚀 ~ RecordPage ~ list:`, list, done);

    const [isOpen, setIsOpen] = useState(false);
    const [currentDetail, setCurrentDetail] = useState<null>(null);
    const handleOpenDetail = (item: { type: string }) => {
        setIsOpen(true);
        setCurrentDetail(item as any);
    };
    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex h-[60px] w-full items-center justify-between bg-[#0a0600] px-5">
                <div onClick={() => setState('home')}>
                    <Icon
                        name="icon-arrow-left"
                        className="h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                </div>
                <div className="text-lg">History</div>
                <div className="w-[14px]"></div>
            </div>
            <div className="w-full flex-1 overflow-y-auto">
                <div className="flex flex-col">
                    <span className="px-5 py-[5px] text-xs text-[#999999]">02/24/2025</span>
                    {/* send / receive */}
                    <div
                        className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]"
                        onClick={() => {
                            handleOpenDetail({ type: 'send' });
                        }}
                    >
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Send</strong>
                                <span className="text-xs text-[#999999]">To uyrhg...cqe</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#EEEEEE]">-11.55 ICP</div>
                    </div>
                    {/* swap */}
                    <div
                        className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]"
                        onClick={() => {
                            handleOpenDetail({ type: 'swap' });
                        }}
                    >
                        <div className="flex items-center">
                            <img src={logo_icp} className="h-10 w-10 rounded-full" />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Swap</strong>
                                <span className="text-xs text-[#999999]">To ICS</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-[#999999]">-1.34 ICP</div>
                            <div className="text-base font-semibold text-[#00C431]">+42,582.76 ICS</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="px-5 py-[5px] text-xs text-[#999999]">01/20/2025</span>
                    {/* send / receive */}
                    <div
                        className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]"
                        onClick={() => {
                            handleOpenDetail({ type: 'send' });
                        }}
                    >
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/xevnm-gaaaa-aaaar-qafnq-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Send</strong>
                                <span className="text-xs text-[#999999]">To uyrhg...cqe</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#EEEEEE]">-374 ckUSDC</div>
                    </div>
                    <div
                        className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]"
                        onClick={() => {
                            handleOpenDetail({ type: 'receive' });
                        }}
                    >
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Reveive</strong>
                                <span className="text-xs text-[#999999]">From 87bba...413</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#00C431]">+36.98 ICP</div>
                    </div>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Reveive</strong>
                                <span className="text-xs text-[#999999]">From 87bba...413</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#00C431]">+92,387,862 ICU</div>
                    </div>
                    {/* swap */}
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img src={logo_icp} className="h-10 w-10 rounded-full" />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Swap</strong>
                                <span className="text-xs text-[#999999]">To ICS</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-[#999999]">-3.8 ICP</div>
                            <div className="text-base font-semibold text-[#00C431]">+89,452.34 ICS</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="px-5 py-[5px] text-xs text-[#999999]">02/11/2025</span>
                    {/* send / receive */}
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Send</strong>
                                <span className="text-xs text-[#999999]">To uyrhg...cqe</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#EEEEEE]">-11.55 ICP</div>
                    </div>
                    {/* swap */}
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img src={logo_icp} className="h-10 w-10 rounded-full" />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Swap</strong>
                                <span className="text-xs text-[#999999]">To ICS</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-[#999999]">-1.34 ICP</div>
                            <div className="text-base font-semibold text-[#00C431]">+42,582.76 ICS</div>
                        </div>
                    </div>
                </div>
            </div>
            {currentDetail && <ShowHistory isOpen={isOpen} setIsOpen={setIsOpen} currentDetail={currentDetail} />}
        </div>
    );
}

export default RecordPage;
