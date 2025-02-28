import { useNavigate } from 'react-router-dom';

import Icon from '~components/icon';

import type { SettingPageState } from '..';

function SettingsHome({ setSettingState }: { setSettingState: (state: SettingPageState) => void }) {
    const navigate = useNavigate();
    return (
        <>
            <div className="mt-6 w-full px-5">
                <div className="flex flex-col overflow-hidden rounded-xl bg-[#181818]">
                    <div
                        onClick={() => navigate('/home/settings/accounts')}
                        className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]"
                    >
                        <div className="flex items-center">
                            <Icon name="icon-wallet" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">Manage Account</span>
                        </div>
                        <div className="flex items-center">
                            <span className="pr-2 text-sm text-[#999999]">2</span>
                            <Icon
                                name="icon-arrow-right"
                                className="h-[9px] w-[14px] cursor-pointer text-[#999999]"
                            ></Icon>
                        </div>
                    </div>

                    <div
                        onClick={() => setSettingState('privacy')}
                        className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]"
                    >
                        <div className="flex items-center">
                            <Icon name="icon-security" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">Security & Privacy</span>
                        </div>
                        <Icon name="icon-arrow-right" className="h-[9px] w-[14px] cursor-pointer text-[#999999]"></Icon>
                    </div>

                    <div
                        onClick={() => setSettingState('preferences')}
                        className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]"
                    >
                        <div className="flex items-center">
                            <Icon name="icon-preferences" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">Preferences Settings</span>
                        </div>
                        <Icon name="icon-arrow-right" className="h-[9px] w-[14px] cursor-pointer text-[#999999]"></Icon>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-full px-5">
                <div className="flex flex-col overflow-hidden rounded-xl bg-[#181818]">
                    <div
                        onClick={() => setSettingState('address')}
                        className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]"
                    >
                        <div className="flex items-center">
                            <Icon name="icon-address" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">Address Book</span>
                        </div>
                        <div className="flex items-center">
                            <span className="pr-2 text-sm text-[#999999]">2</span>
                            <Icon
                                name="icon-arrow-right"
                                className="h-[9px] w-[14px] cursor-pointer text-[#999999]"
                            ></Icon>
                        </div>
                    </div>
                    <div
                        onClick={() => setSettingState('applications')}
                        className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]"
                    >
                        <div className="flex items-center">
                            <Icon name="icon-dapps" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">Linked Applications</span>
                        </div>
                        <div className="flex items-center">
                            <span className="pr-2 text-sm text-[#999999]">18</span>
                            <Icon
                                name="icon-arrow-right"
                                className="h-[9px] w-[14px] cursor-pointer text-[#999999]"
                            ></Icon>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-full px-5">
                <div
                    onClick={() => setSettingState('lock')}
                    className="flex flex-col overflow-hidden rounded-xl bg-[#181818]"
                >
                    <div className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]">
                        <div className="flex items-center">
                            <Icon name="icon-locked" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">Lock Wallet</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 w-full px-5">
                <div
                    onClick={() => setSettingState('about')}
                    className="flex flex-col overflow-hidden rounded-xl bg-[#181818]"
                >
                    <div className="flex w-full cursor-pointer items-center justify-between p-3 duration-300 hover:bg-[#2B2B2B]">
                        <div className="flex items-center">
                            <Icon name="icon-tips" className="h-4 w-4 cursor-pointer text-[#FFCF13]"></Icon>
                            <span className="px-3 text-sm text-[#EEEEEE]">About Fuse</span>
                        </div>
                        <div className="flex items-center">
                            <span className="pr-2 text-sm text-[#999999]">V1.1</span>
                            <Icon
                                name="icon-arrow-right"
                                className="h-[9px] w-[14px] cursor-pointer text-[#999999]"
                            ></Icon>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SettingsHome;
