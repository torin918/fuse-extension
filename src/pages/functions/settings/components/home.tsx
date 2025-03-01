import Icon from '~components/icon';
import { useIdentityKeysCount } from '~hooks/store/local-secure';

import type { SettingPageState } from '..';
import { SettingsGroup } from './group';
import { SettingsItem } from './item';

function SettingsHome({ setSettingState }: { setSettingState: (state: SettingPageState) => void }) {
    const account_count = useIdentityKeysCount();

    return (
        <>
            <SettingsGroup className="mt-6 w-full px-5">
                <SettingsItem
                    icon={<Icon name="icon-wallet" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={'/home/settings/accounts'}
                    title="Manage Account"
                    right={`${account_count}`}
                />

                <SettingsItem
                    icon={<Icon name="icon-security" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={'/home/settings/security'}
                    title="Security & Privacy"
                />

                <SettingsItem
                    icon={<Icon name="icon-preferences" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={() => setSettingState('preferences')}
                    title="Preferences Settings"
                />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsItem
                    icon={<Icon name="icon-address" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={() => setSettingState('address')}
                    title="Address Book"
                    right="2"
                />

                <SettingsItem
                    icon={<Icon name="icon-dapps" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={() => setSettingState('applications')}
                    title="Linked Applications"
                    right="18"
                />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsItem
                    icon={<Icon name="icon-locked" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={() => setSettingState('lock')}
                    title="Lock Wallet"
                    arrow={false}
                />
            </SettingsGroup>
            <SettingsGroup>
                <SettingsItem
                    icon={<Icon name="icon-tips" className="h-4 w-4 cursor-pointer text-[#FFCF13]" />}
                    path={() => setSettingState('about')}
                    title="About Fuse"
                    right="V1.1"
                />
            </SettingsGroup>
        </>
    );
}

export default SettingsHome;
