import { useNavigate } from 'react-router-dom';

import Icon from '~components/icon';
import { useIdentityKeysCount } from '~hooks/store/local-secure';

import type { SettingPageState } from '..';

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
                    path={() => setSettingState('privacy')}
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

const SettingsGroup = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    return (
        <div className={className ?? 'mt-4 w-full px-5'}>
            <div className="flex flex-col overflow-hidden rounded-xl bg-[#181818]">{children}</div>
        </div>
    );
};

const SettingsItem = ({
    icon,
    path,
    title,
    right,
    arrow = true,
}: {
    icon: React.ReactNode;
    path: string | (() => void);
    title: string;
    right?: string;
    arrow?: boolean;
}) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => {
                if (typeof path === 'string') navigate(path);
                else path();
            }}
            className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] p-3 duration-300 hover:bg-[#2B2B2B]"
        >
            <div className="flex items-center">
                {icon}
                <span className="px-3 text-sm text-[#EEEEEE]">{title}</span>
            </div>
            <div className="flex items-center">
                {right && <span className="pr-2 text-sm text-[#999999]">{right}</span>}
                {arrow && <Icon name="icon-arrow-right" className="h-[9px] w-[14px] cursor-pointer text-[#999999]" />}
            </div>
        </div>
    );
};
