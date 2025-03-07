import { useEffect } from 'react';
import { useInterval } from 'usehooks-ts';

import { usePasswordAlive } from '~hooks/store/session';
import { useUserSettingsIdle } from '~hooks/store/sync';
import { CurrentState } from '~types/state';

import { useCurrentState } from './current_state';
import { useLock } from './lock';

export const useBackground = () => {
    const current_state = useCurrentState();
    const lock = useLock();
    const [idle] = useUserSettingsIdle();
    const [password_alive] = usePasswordAlive();

    // TODO TEST
    useEffect(() => {
        console.debug('CURRENT STATE:', current_state);
    }, [current_state]);

    // always check idle
    useInterval(() => {
        if (current_state !== CurrentState.ALIVE) return;
        const now = Date.now();
        if (password_alive + idle < now) {
            // console.error('do lock by idle', 'password_alive->', password_alive, 'idle->', idle);
            lock('idle');
        }
    }, 33);
};
