import { useEffect } from 'react';

import { useCurrentState } from '~hooks/memo/current_state';
import { useNavigatePages } from '~hooks/navigate';
import { usePopupActions } from '~hooks/store';
import { get_popup_action_id, match_popup_action, type PopupAction } from '~types/actions';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

import ApproveIcActionPage from './approve-ic';
import ConnectActionPage from './connect';

function ActionsPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();
    useNavigatePages(current_state, true); // can not go back

    const [popup_actions, , { deletePopupAction }] = usePopupActions();
    useEffect(() => {
        if (popup_actions && popup_actions.length === 0 && wt === 'notification') {
            console.error('do close notification window when popup actions is empty ');
            window.close();
        }
    }, [popup_actions, wt]);

    if (current_state !== CurrentState.ACTION) return <></>;
    return (
        <>
            {0 < popup_actions.length && (
                <InnerActionPage action={popup_actions[0]} deletePopupAction={deletePopupAction} />
            )}
        </>
    );
}

export default ActionsPage;

const InnerActionPage = ({
    action,
    deletePopupAction,
}: {
    action: PopupAction;
    deletePopupAction: (action: PopupAction) => Promise<void>;
}) => {
    return (
        <div>
            <div className="h-full w-full">
                <div>unique_id: {get_popup_action_id(action)}</div>
                {match_popup_action(action, {
                    connect: (connect) => (
                        <ConnectActionPage action={action} connect={connect} deletePopupAction={deletePopupAction} />
                    ),
                    approve_ic: (approve_ic) => (
                        <ApproveIcActionPage
                            action={action}
                            approve_ic={approve_ic}
                            deletePopupAction={deletePopupAction}
                        />
                    ),
                })}
            </div>
        </div>
    );
};
