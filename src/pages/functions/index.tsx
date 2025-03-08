import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import type { WindowType } from '~types/pages';

import HomePage from '../home';

export type MainPageState = 'home';

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
    const { current_identity } = useCurrentIdentity();
    console.debug(`🚀 ~ MainPage ~ current_identity:`, wt, current_identity);

    if (!current_identity) return <></>;
    return <div className="h-full w-full">{<HomePage current_identity={current_identity}></HomePage>}</div>;
};
