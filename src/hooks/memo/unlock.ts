import { useCallback } from 'react';

import { refreshPasswordDirectly } from '~hooks/store';
import { verify_password } from '~lib/password';
import { CurrentState } from '~types/state';

export const useUnlock = (
    current_state: CurrentState,
    password_hashed: string,
): ((password: string) => Promise<void>) => {
    // set password when locked
    const unlock = useCallback(
        async (password: string) => {
            // TODO remove on prod
            console.debug(`🚀 ~ unlock account ~ :`, 'password ->', password);

            if (current_state !== CurrentState.LOCKED) return;
            if (!password_hashed) return;
            const checked = await verify_password(password_hashed, password);
            if (!checked) return;

            await refreshPasswordDirectly(password);
        },
        [current_state, password_hashed],
    );

    return unlock;
};
