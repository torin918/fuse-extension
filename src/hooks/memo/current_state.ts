import { useMemo } from 'react';

import type { PopupActions } from '~types/actions';
import { CurrentState } from '~types/state';

import { usePassword, usePasswordHashed, usePopupActions, useWelcomed } from '../store';

export const useCurrentStateBy = (
    welcomed: boolean,
    password_hashed: string,
    password: string,
    popup_actions: PopupActions,
) => {
    const current_state = useMemo<CurrentState>(() => {
        // console.error('current_state', password_hashed, 'p->', password);
        if (!welcomed) return CurrentState.WELCOME;
        if (!password_hashed) return CurrentState.INITIAL;
        if (!password) return CurrentState.LOCKED;
        if (password_hashed && password) {
            if (popup_actions && popup_actions.length) return CurrentState.ACTION;
            return CurrentState.ALIVE;
        }
        console.error('can not be here');
        return CurrentState.INITIAL;
    }, [welcomed, password_hashed, password, popup_actions]);

    return current_state;
};

export const useCurrentState = () => {
    const [welcomed] = useWelcomed();
    const [password_hashed] = usePasswordHashed();
    const [password] = usePassword();
    const [popup_actions] = usePopupActions();
    return useCurrentStateBy(welcomed, password_hashed, password, popup_actions);
};
