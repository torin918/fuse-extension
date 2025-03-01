import { useCallback, useEffect, useState } from 'react';

import type { Storage, StorageWatchCallback } from '@plasmohq/storage';

import { same } from '~lib/utils/same';
import { is_same_popup_action, type PopupAction, type PopupActions } from '~types/actions';

import { SESSION_KEY_POPUP_ACTIONS } from '../keys';

// ! always try to use this value to avoid BLINK
let cached_popup_actions: PopupActions = [];

// popup actions -> // * session
export const usePopupActionsInner = (
    storage: Storage,
): [
    PopupActions,
    (value: PopupActions) => Promise<void>,
    {
        deletePopupAction: (action: PopupAction) => Promise<void>;
    },
] => {
    const [popup_actions, setPopupActions] = useState(cached_popup_actions); // use cached value to init

    // watch this key, cloud notice other hook of this
    useEffect(() => {
        const callback: StorageWatchCallback = (d) => {
            const popup_actions = d.newValue ?? [];
            if (!same(cached_popup_actions, popup_actions)) cached_popup_actions = popup_actions;
            setPopupActions(popup_actions);
        };
        storage.watch({ [SESSION_KEY_POPUP_ACTIONS]: callback });
        return () => {
            storage.unwatch({ [SESSION_KEY_POPUP_ACTIONS]: callback });
        };
    }, [storage]);

    // init on this hook
    useEffect(() => {
        storage.get<PopupActions>(SESSION_KEY_POPUP_ACTIONS).then((data) => {
            if (data === undefined) data = cached_popup_actions;
            cached_popup_actions = data;
            setPopupActions(data);
        });
    }, [storage]);

    // update on this hook
    const updatePopupActions = useCallback(
        async (popup_actions: PopupActions) => {
            await storage.set(SESSION_KEY_POPUP_ACTIONS, popup_actions);
            cached_popup_actions = popup_actions;
            setPopupActions(popup_actions);
        },
        [storage],
    );

    const deletePopupAction = useCallback(
        async (action: PopupAction) => {
            console.error(`🚀 ~ deletePopupAction action:`, action);
            if (!popup_actions) return;
            const a = popup_actions.find((a) => is_same_popup_action(a, action));
            if (a === undefined) return;
            const actions = popup_actions.filter((a) => !is_same_popup_action(a, action));
            await updatePopupActions(actions);
        },
        [popup_actions, updatePopupActions],
    );

    return [popup_actions, updatePopupActions, { deletePopupAction }];
};
