import { Button } from '@heroui/react';
import { useCallback, useMemo } from 'react';

import { set_current_session_approve } from '~hooks/store';
import { useCurrentConnectedApps } from '~hooks/store/local-secure';
import { get_popup_action_id, type PopupAction } from '~types/actions';
import type { ApproveIcAction } from '~types/actions/approve-ic';

function ApproveIcActionPage({
    action,
    approve_ic,
    deletePopupAction,
}: {
    action: PopupAction;
    approve_ic: ApproveIcAction;
    deletePopupAction: (action: PopupAction) => Promise<void>;
}) {
    const [current_connected_apps, , { current_identity, current_chain_network }] = useCurrentConnectedApps();

    const app = useMemo(() => {
        if (!current_connected_apps) return undefined;
        const origin = approve_ic.origin;
        const apps = current_connected_apps.ic;
        const app = apps.find((app) => app.origin === origin);
        return app;
    }, [approve_ic, current_connected_apps]);

    const onAction = useCallback(
        async (type: 'deny' | 'approve') => {
            if (!current_identity) return;
            if (!current_chain_network) return;
            // record
            const approve_id = get_popup_action_id(action);
            new Promise<void>((resolve) => {
                if (type === 'deny') {
                    set_current_session_approve(
                        current_identity,
                        current_chain_network,
                        'ic',
                        approve_ic.origin,
                        approve_id,
                        false,
                    ).then(resolve);
                } else if (type === 'approve') {
                    set_current_session_approve(
                        current_identity,
                        current_chain_network,
                        'ic',
                        approve_ic.origin,
                        approve_id,
                        true,
                    ).then(resolve);
                } else resolve();
            }).then(() => deletePopupAction(action));
        },
        [approve_ic, deletePopupAction, action, current_identity, current_chain_network],
    );
    return (
        <div>
            <div className="h-full w-full">
                <div>origin: {approve_ic.origin}</div>
                <div>title: {app?.title}</div>
                <div>{app?.favicon && <img src={app.favicon} />}</div>
                <Button onPress={() => onAction('deny')}>Deny</Button>
                <Button onPress={() => onAction('approve')}>Approve</Button>
            </div>
        </div>
    );
}

export default ApproveIcActionPage;
