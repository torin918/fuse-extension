import { Button } from '@heroui/react';
import { useCallback } from 'react';

import { set_current_session_connected_app_message } from '~hooks/store';
import { useCurrentConnectedApps } from '~hooks/store/local-secure';
import type { PopupAction } from '~types/actions';
import type { ConnectAction } from '~types/actions/connect';
import type { ConnectedApp, ConnectedAppState } from '~types/connect';

function ConnectActionPage({
    action,
    connect,
    deletePopupAction,
}: {
    action: PopupAction;
    connect: ConnectAction;
    deletePopupAction: (action: PopupAction) => Promise<void>;
}) {
    const [, , { current_chain_network, current_identity, pushOrUpdateConnectedApp }] = useCurrentConnectedApps();

    const onAction = useCallback(
        async (type: 'deny' | 'deny_once' | 'granted_once' | 'granted' | 'granted_5m') => {
            if (!current_identity) return;
            if (!current_chain_network) return;
            // insert connected app info
            const now = Date.now();
            const state = await (async (): Promise<ConnectedAppState> => {
                switch (type) {
                    case 'deny':
                        return 'denied';
                    case 'deny_once':
                        return 'ask_on_use';
                    case 'granted_once':
                        return 'ask_on_use';
                    case 'granted':
                        return 'granted';
                    case 'granted_5m':
                        return { granted_expired: now + 1000 * 50 * 5 };
                }
            })();
            const app: ConnectedApp = {
                created: now,
                origin: connect.origin,
                title: connect.title,
                favicon: connect.favicon,
                state,
                updated: now,
            };
            pushOrUpdateConnectedApp(connect.chain, app)
                .then(
                    () =>
                        new Promise<void>((resolve) => {
                            if (type === 'deny_once') {
                                set_current_session_connected_app_message(
                                    current_identity,
                                    current_chain_network,
                                    connect.chain,
                                    connect.origin,
                                    connect.message_id,
                                    false,
                                ).then(resolve);
                            } else if (type === 'granted_once') {
                                set_current_session_connected_app_message(
                                    current_identity,
                                    current_chain_network,
                                    connect.chain,
                                    connect.origin,
                                    connect.message_id,
                                    true,
                                ).then(resolve);
                            } else resolve();
                        }),
                )
                .then(() => deletePopupAction(action));
        },
        [connect, pushOrUpdateConnectedApp, deletePopupAction, action, current_identity, current_chain_network],
    );
    return (
        <div>
            <div className="h-full w-full">
                <div>origin: {connect.origin}</div>
                <div>title: {connect.title}</div>
                <div>{connect.favicon && <img src={connect.favicon} />}</div>
                <Button onPress={() => onAction('deny')}>Always Deny</Button>
                <Button onPress={() => onAction('deny_once')}>Deny This Time</Button>
                <Button onPress={() => onAction('granted_once')}>Granted This Time</Button>
                <Button onPress={() => onAction('granted')}>Always Granted</Button>
                <Button onPress={() => onAction('granted_5m')}>Granted 5m</Button>
            </div>
        </div>
    );
}

export default ConnectActionPage;
