import { Switch } from '@heroui/react';

import Icon from '~components/icon';

function PreferencesPage() {
    return (
        <div className="mt-6 w-full px-5">
            <div className="flex flex-col overflow-hidden rounded-xl bg-[#181818]">
                <div className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]">
                    <span className="px-3 text-sm text-[#EEEEEE]">Currency</span>
                    <div className="flex items-center">
                        <span className="pr-2 text-sm text-[#999999]">USD</span>
                        <Icon name="icon-arrow-right" className="h-[9px] w-[14px] cursor-pointer text-[#999999]"></Icon>
                    </div>
                </div>

                <div className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]">
                    <span className="px-3 text-sm text-[#EEEEEE]">Language</span>
                    <div className="flex items-center">
                        <span className="pr-3 text-sm text-[#999999]">English</span>
                        <Icon name="icon-arrow-right" className="h-[9px] w-[14px] cursor-pointer text-[#999999]"></Icon>
                    </div>
                </div>
            </div>
            <div className="mt-3 flex flex-col overflow-hidden rounded-xl bg-[#181818]">
                <div className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]">
                    <span className="px-3 text-sm text-[#EEEEEE]">Fuse wallet actions on web</span>
                    <div className="switch-xs">
                        <Switch defaultSelected color="success" size="sm"></Switch>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreferencesPage;
