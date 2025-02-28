import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { CurrentState } from '~types/state';

import AboutPage from './components/about';
import AccountPage from './components/account';
import AddressPage from './components/address';
import ApplicationsPage from './components/applications';
import SettingsHome from './components/home';
import LockPage from './components/lock';
import PreferencesPage from './components/preferences';
import PrivacyPage from './components/privacy';

export type SettingPageState =
    | 'home'
    | 'account'
    | 'privacy'
    | 'preferences'
    | 'address'
    | 'applications'
    | 'lock'
    | 'about';

function FunctionSettingsPage() {
    const current_address = useCurrentState();

    const navigate = useNavigate();

    const [settingState, setSettingState] = useState<SettingPageState>('home');

    const title = useMemo(() => {
        switch (settingState) {
            case 'home':
                return 'Setting';
            case 'account':
                return 'Manage Account';
            case 'privacy':
                return 'Security & Privacy';
            case 'preferences':
                return 'Preferences Settings';
            case 'address':
                return 'Address';
            case 'applications':
                return 'Linked Applications';
            case 'lock':
                return 'Lock Wallet';
            case 'about':
                return 'About Fuse';
            default:
                return 'Setting';
        }
    }, [settingState]);

    return (
        <FusePage current_state={current_address} states={CurrentState.ALIVE}>
            <div className="w-full pt-[60px]">
                <div className="fixed top-0 flex w-full items-center justify-between bg-[#0a0600] px-5 py-3">
                    <div onClick={() => navigate('/')}>
                        <Icon
                            name="icon-arrow-left"
                            className="h-[14px] w-[19px] cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                        ></Icon>
                    </div>
                    <div className="text-lg">{title}</div>
                    <div className="w-[14px]" onClick={() => navigate('/')}>
                        <Icon
                            name="icon-close"
                            className="h-5 w-5 cursor-pointer text-[#FFCF13] duration-300 hover:opacity-85"
                        ></Icon>
                    </div>
                </div>
                <TransitionGroup>
                    <CSSTransition key={settingState} classNames="slide" timeout={300}>
                        <div>
                            {settingState === 'home' && <SettingsHome setSettingState={setSettingState} />}
                            {settingState === 'account' && <AccountPage />}
                            {settingState === 'privacy' && <PrivacyPage />}
                            {settingState === 'preferences' && <PreferencesPage />}
                            {settingState === 'address' && <AddressPage />}
                            {settingState === 'applications' && <ApplicationsPage />}
                            {settingState === 'lock' && <LockPage />}
                            {settingState === 'about' && <AboutPage />}
                        </div>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </FusePage>
    );
}

export default FunctionSettingsPage;
