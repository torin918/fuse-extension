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
                {/* <div className="h1">Welcome</div>
                <div>...</div> */}
                <div className="mt-10">
                    <Button
                        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                        size="md"
                        onPress={() => setWelcomed(true)}
                    >
                        Create your own wallet
                    </Button>
                </div>
            </div>
        </FusePage>
    );
}

export default WelcomePage;
