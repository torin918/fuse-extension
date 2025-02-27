export const showToast = () => {
    return (
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
    );
};
