import { Button } from '@heroui/react';
import { useCallback } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Icon from '~components/icon';
import { showToast } from '~components/toast';
import { identity_network_callback } from '~hooks/store/common';
import { push_local_record } from '~hooks/store/local';
import { useCurrentConnectedApps } from '~hooks/store/local-secure';
import { set_current_session_connected_app_once } from '~hooks/store/session';
import { MINUTE } from '~lib/utils/datetime';
import type { PopupAction } from '~types/actions';
import type { ConnectAction } from '~types/actions/connect';
import { match_connected_app_state, type ConnectedApp, type ConnectedAppState } from '~types/connect';
import type { FuseRecord } from '~types/records';

function ConnectActionPage({
    action,
    connect,
    deletePopupAction,
}: {
    action: PopupAction;
    connect: ConnectAction;
    deletePopupAction: (action: PopupAction) => Promise<void>;
}) {
    const [, , { current_identity_network, pushOrUpdateConnectedApp }] = useCurrentConnectedApps();

    const onAction = useCallback(
        async (type: 'deny' | 'deny_once' | 'granted_once' | 'granted' | 'granted_5m') => {
            if (!current_identity_network) return;
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
                        return { granted_expired: { created: now, duration: MINUTE * 5 } };
                }
            })();

            // ! push record
            const record_state = match_connected_app_state(state, {
                denied: () => undefined,
                ask_on_use: () => (type === 'granted_once' ? state : undefined),
                granted: () => state,
                denied_session: () => undefined,
                granted_session: () => state,
                denied_expired: () => undefined,
                granted_expired: () => state,
            });
            if (record_state !== undefined) {
                const record: FuseRecord = {
                    connected: {
                        type: 'connected',
                        created: now,
                        chain: connect.chain,
                        origin: connect.origin,
                        title: connect.title,
                        favicon: connect.favicon,
                        state: record_state,
                    },
                };
                await identity_network_callback(
                    connect.chain,
                    current_identity_network,
                    undefined,
                    async (identity_network) => push_local_record(identity_network, now, record),
                );
            }

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
                                set_current_session_connected_app_once(
                                    connect.chain,
                                    current_identity_network,
                                    connect.origin,
                                    connect.message_id,
                                    false,
                                ).then(resolve);
                            } else if (type === 'granted_once') {
                                set_current_session_connected_app_once(
                                    connect.chain,
                                    current_identity_network,
                                    connect.origin,
                                    connect.message_id,
                                    true,
                                ).then(resolve);
                            } else resolve();
                        }),
                )
                .then(() => deletePopupAction(action));
        },
        [connect, pushOrUpdateConnectedApp, deletePopupAction, action, current_identity_network],
    );
    return (
        <div className="flex h-screen w-full flex-col justify-between">
            <div className="flex w-full items-center border-b border-[#333333] px-5 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-2xl">😄</div>
                <span className="px-2 text-sm font-semibold">Wallet 1</span>
                <CopyToClipboard
                    text={'wallet'}
                    onCopy={() => {
                        showToast('Copied', 'success');
                    }}
                >
                    <Icon name="icon-copy" className="h-3 w-3 cursor-pointer text-[#999999] hover:text-[#FFCF13]" />
                </CopyToClipboard>
            </div>
            <div className="overflow-y-1 mt-4 w-full flex-1 px-5">
                <div className="flex w-full items-center">
                    {/* {connect.favicon && <img src={connect.favicon} className="h-12 w-12 rounded-full" />} */}
                    <img
                        src="https://app.icpswap.com/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png"
                        className="mr-3 h-12 w-12 rounded-full"
                    />
                    <div className="w-auto">
                        <strong className="block text-lg font-semibold">Connect</strong>
                        <span className="text-sm text-[#999999]">icpswap.com</span>
                    </div>
                </div>
                <div className="block py-2 text-sm text-[#999999]">{connect.title}</div>
                <div className="block text-sm text-[#999999]">{connect.origin}</div>
                <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-[#181818] px-4 py-3">
                    <span className="text-sm">Account</span>
                    <span className="text-sm text-[#999999]">Wallet 1</span>
                </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-3 p-5">
                {/* <Button onPress={() => onAction('deny')}>Always Deny</Button> */}
                <Button
                    className="h-12 w-full rounded-xl bg-[#666666] text-lg font-semibold text-white"
                    onPress={() => onAction('deny_once')}
                >
                    Cancel
                </Button>
                <Button
                    className="h-12 w-full rounded-xl bg-[#FFCF13] text-lg font-semibold text-black"
                    onPress={() => onAction('granted_once')}
                >
                    Connect
                </Button>
                {/* <Button onPress={() => onAction('granted')}>Always Granted</Button> */}
                {/* <Button onPress={() => onAction('granted_5m')}>Granted 5m</Button> */}
            </div>
        </div>
    );
}

export default ConnectActionPage;
