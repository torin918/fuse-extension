import CopyToClipboard from 'react-copy-to-clipboard';

import Img_logo from '~assets/svg/logo.svg';
import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { SettingsGroup } from '../components/group';
import { SettingsHeader } from '../components/header';
import { SettingsItem } from '../components/item';

function FunctionSettingsAboutPage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();
    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <SettingsHeader
                        title={'Preferences Settings'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="w-full px-5">
                    <div className="flex w-full flex-col items-center justify-center py-[50px]">
                        <div className="w-[70px]">
                            <img src={Img_logo} className="w-full" />
                        </div>
                        <span className="py-3 text-3xl font-bold text-[#FFCF13]">FUSE</span>
                        <span className="text-sm text-[#999999]">Version 1.0</span>
                    </div>

                    <SettingsGroup className="mt-6 w-full">
                        <SettingsItem
                            path={() => {
                                showToast('not implemented');
                            }}
                            title="Terms of Service"
                            arrow={false}
                            right={
                                <Icon
                                    name="icon-jump"
                                    className="h-4 w-4 cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                />
                            }
                        />
                        <SettingsItem
                            path={() => {
                                showToast('not implemented');
                            }}
                            title="Privacy policy"
                            arrow={false}
                            right={
                                <Icon
                                    name="icon-jump"
                                    className="h-4 w-4 cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                />
                            }
                        />
                        <SettingsItem
                            path={() => {
                                showToast('not implemented');
                            }}
                            title="Contact"
                            arrow={false}
                            right={
                                <CopyToClipboard
                                    text="Contact@Fuse.com"
                                    onCopy={() => {
                                        showToast('Copied', 'success');
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span className="pr-3 text-sm text-[#999999]">Contact@Fuse.com</span>
                                        <Icon
                                            name="icon-copy"
                                            className="h-[14px] w-[14px] cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                                        ></Icon>
                                    </div>
                                </CopyToClipboard>
                            }
                        />
                    </SettingsGroup>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsAboutPage;
