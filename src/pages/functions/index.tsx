import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import type { WindowType } from '~types/pages';

import HomePage from './home';
import RecordPage from './record';
import SearchPage from './search';

export type MainPageState = 'home' | 'search' | 'record';

function MainPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();

    return (
        <FusePage current_state={current_state} pathname={true}>
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
        <div className="flex h-full w-full items-center justify-center">
            {state === 'home' && <HomePage setState={setState} current_address={current_identity.address}></HomePage>}
            <TransitionGroup component={null}>
                {state === 'search' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <SearchPage setState={setState}></SearchPage>
                    </CSSTransition>
                )}
                {state === 'record' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <RecordPage setState={setState}></RecordPage>
                    </CSSTransition>
                )}
            </TransitionGroup>
        </div>
    );
};
