import { Button } from '@heroui/react';

import { useCurrentState } from '~hooks/memo/current_state';
import { useNavigatePages } from '~hooks/navigate';
import { useWelcomed } from '~hooks/store';
import { CurrentState } from '~types/state';

function WelcomePage() {
    const current_state = useCurrentState();
    useNavigatePages(current_state, false); // can go back

    const [, setWelcomed] = useWelcomed();

    if (current_state !== CurrentState.WELCOME) return <></>;
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <div>Welcome Page</div>
            <div>...</div>
            <div>
                <Button onPress={() => setWelcomed(true)}>Init</Button>
            </div>
        </div>
    );
}

export default WelcomePage;
