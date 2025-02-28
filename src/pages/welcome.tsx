import { Button } from '@heroui/react';

import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { useWelcomed } from '~hooks/store';
import { CurrentState } from '~types/state';

function WelcomePage() {
    const current_state = useCurrentState();

    const [, setWelcomed] = useWelcomed();

    return (
        <FusePage current_state={current_state} states={CurrentState.WELCOME}>
            <div className="flex h-screen w-full flex-col items-center justify-center">
                <div>Welcome Page</div>
                <div>...</div>
                <div>
                    <Button onPress={() => setWelcomed(true)}>Init</Button>
                </div>
            </div>
        </FusePage>
    );
}

export default WelcomePage;
