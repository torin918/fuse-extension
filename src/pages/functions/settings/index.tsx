import { useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { SettingsHeader } from './components/header';
import SettingsHome from './components/home';

export type SettingPageState = 'home';

function FunctionSettingsPage() {
    const current_state = useCurrentState();

    const { setHide, goto } = useGoto();

    const [settingState, setSettingState] = useState<SettingPageState>('home');

    const title = useMemo(() => {
        switch (settingState) {
            case 'home':
                return 'Settings';
            default:
                return 'Setting';
        }
    }, [settingState]);

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-center pt-[60px]">
                    <SettingsHeader title={title} onBack={() => goto('/')} onClose={() => goto('/')} />

                    <TransitionGroup component={null}>
                        {settingState === 'home' && (
                            <CSSTransition key={settingState} classNames="slide" timeout={300} unmountOnExit>
                                <SettingsHome setSettingState={setSettingState} />
                            </CSSTransition>
                        )}
                    </TransitionGroup>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsPage;
