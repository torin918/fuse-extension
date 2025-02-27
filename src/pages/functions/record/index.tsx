import Logo_icpex from '~assets/svg/icpex.svg';
import Icon from '~components/icon';
import type { MainPageState } from '~pages/functions';

function RecordPage({ setState }: { setState: (state: MainPageState) => void }) {
    return (
        <div className="w-full pt-[60px]">
            <div className="fixed top-0 flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                <div onClick={() => setState('home')}>
                    <Icon
                        name="icon-arrow-left"
                        className="h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                    ></Icon>
                </div>
                <div className="text-lg">History</div>
                <div className="w-[14px]"></div>
            </div>
            <div className="w-full">
                <div className="flex flex-col">
                    <span className="px-5 py-[5px] text-xs text-[#999999]">02/24/2025</span>
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
                            <img src={Logo_icpex} className="h-10 w-10 rounded-full" />
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
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
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
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
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
                            <img src={Logo_icpex} className="h-10 w-10 rounded-full" />
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
                            <img src={Logo_icpex} className="h-10 w-10 rounded-full" />
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
        </div>
    );
}

export default RecordPage;
