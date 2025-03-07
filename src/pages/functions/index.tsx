import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import type { WindowType } from '~types/pages';

import HomePage from '../home';
import RecordPage from './record';

export type MainPageState = 'home' | 'record';

function MainPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();

    return (
        <FusePage
            current_state={current_state}
            pathname={true}
            options={{
                refresh_token_price_ic_sleep: 1000 * 60,
            }}
        >
            <InnerMainPage wt={wt} />
        </FusePage>
    );
}

export default MainPage;

const InnerMainPage = ({ wt }: { wt: WindowType }) => {
    const current_identity = useCurrentIdentity();
    console.debug(`🚀 ~ MainPage ~ current_identity:`, wt, current_identity);

    const [state, setState] = useState<MainPageState>('home');

    if (!current_identity) return <></>;
    return (
        <div className="h-full w-full">
            {state === 'home' && <HomePage setState={setState} current_identity={current_identity}></HomePage>}
            <TransitionGroup component={null}>
                {state === 'record' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <RecordPage setState={setState}></RecordPage>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
};
