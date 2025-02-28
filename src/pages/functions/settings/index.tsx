import { useMemo, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityKeysCount } from '~hooks/store/local-secure';

import AboutPage from './components/about';
import AddressPage from './components/address';
import ApplicationsPage from './components/applications';
import { SettingsHeader } from './components/header';
import SettingsHome from './components/home';
import LockPage from './components/lock';
import PreferencesPage from './components/preferences';
import PrivacyPage from './components/privacy';

export type SettingPageState = 'home' | 'privacy' | 'preferences' | 'address' | 'applications' | 'lock' | 'about';

function FunctionSettingsPage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();

    const [settingState, setSettingState] = useState<SettingPageState>('home');

    const title = useMemo(() => {
        switch (settingState) {
            case 'home':
                return 'Settings';
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

    const ref = useRef(null);

    return (
        <FusePage current_state={current_address}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-center pt-[60px]">
                    <SettingsHeader title={title} onBack={() => goto('/')} onClose={() => goto('/')} />

                    <TransitionGroup>
                        <CSSTransition nodeRef={ref} key={settingState} classNames="fuse-page-left" timeout={300}>
                            <div>
                                {settingState === 'home' && (
                                    <div ref={ref}>
                                        <SettingsHome setSettingState={setSettingState} />
                                    </div>
                                )}
                                {settingState === 'privacy' && (
                                    <div ref={ref}>
                                        <PrivacyPage />
                                    </div>
                                )}
                                {settingState === 'preferences' && (
                                    <div ref={ref}>
                                        <PreferencesPage />
                                    </div>
                                )}
                                {settingState === 'address' && (
                                    <div ref={ref}>
                                        <AddressPage />
                                    </div>
                                )}
                                {settingState === 'applications' && (
                                    <div ref={ref}>
                                        <ApplicationsPage />
                                    </div>
                                )}
                                {settingState === 'lock' && (
                                    <div ref={ref}>
                                        <LockPage />
                                    </div>
                                )}
                                {settingState === 'about' && (
                                    <div ref={ref}>
                                        <AboutPage />
                                    </div>
                                )}
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsPage;
