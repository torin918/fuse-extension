import { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { useCurrentAddress } from '~hooks/store/local-secure';
import type { WindowType } from '~types/pages';

import HomePage from './home';
import ReceivePage from './receive';
import RecordPage from './record';
import SearchPage from './search';
import SendPage from './send';
import SwapPage from './swap';

export type MainPageState = 'home' | 'search' | 'send' | 'receive' | 'swap' | 'record';

function MainPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();

    return (
        <FusePage current_state={current_state}>
            <InnerMainPage wt={wt} />
        </FusePage>
    );
}

export default MainPage;

const InnerMainPage = ({ wt }: { wt: WindowType }) => {
    const current_address = useCurrentAddress();
    console.debug(`🚀 ~ MainPage ~ current_address:`, wt, current_address);

    const [state, setState] = useState<MainPageState>('home');

    if (!current_address) return <></>;
    return (
        <div className="flex h-full w-full items-center justify-center">
            {state === 'home' && <HomePage setState={setState} current_address={current_address}></HomePage>}
            <TransitionGroup component={null}>
                {state === 'search' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <SearchPage setState={setState}></SearchPage>
                    </CSSTransition>
                )}
                {state === 'send' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <SendPage setState={setState}></SendPage>
                    </CSSTransition>
                )}
                {state === 'receive' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <ReceivePage setState={setState}></ReceivePage>
                    </CSSTransition>
                )}
                {state === 'swap' && (
                    <CSSTransition key={state} classNames="slide" timeout={300} unmountOnExit>
                        <SwapPage setState={setState}></SwapPage>
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
