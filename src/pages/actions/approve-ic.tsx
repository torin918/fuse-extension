import { Button } from '@heroui/react';
import { useCallback, useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Icon from '~components/icon';
import { showToast } from '~components/toast';
import { useCurrentConnectedApps } from '~hooks/store/local-secure';
import { set_current_session_approve } from '~hooks/store/session';
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
    const [current_connected_apps, , { current_identity_network }] = useCurrentConnectedApps();

    const app = useMemo(() => {
        if (!current_connected_apps) return undefined;
        const origin = approve_ic.origin;
        const apps = current_connected_apps.ic;
        const app = apps.find((app) => app.origin === origin);
        return app;
    }, [approve_ic, current_connected_apps]);

    const onAction = useCallback(
        async (type: 'deny' | 'approve') => {
            if (!current_identity_network) return;
            // record
            const approve_id = get_popup_action_id(action);
            new Promise<void>((resolve) => {
                if (type === 'deny') {
                    set_current_session_approve(
                        'ic',
                        current_identity_network,
                        approve_ic.origin,
                        approve_id,
                        false,
                    ).then(resolve);
                } else if (type === 'approve') {
                    set_current_session_approve(
                        'ic',
                        current_identity_network,
                        approve_ic.origin,
                        approve_id,
                        true,
                    ).then(resolve);
                } else resolve();
            }).then(() => deletePopupAction(action));
        },
        [approve_ic, deletePopupAction, action, current_identity_network],
    );
    return (
        <div>
            <div className="flex h-screen w-full flex-col justify-between">
                <div className="flex w-full items-center border-b border-[#333333] px-5 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-2xl">
                        😄
                    </div>
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
                    {/*<div>{app?.favicon && <img src={app.favicon} />}</div> */}
                    <div className="flex w-full items-center">
                        <img
                            src="https://app.icpswap.com/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png"
                            className="mr-3 h-12 w-12 rounded-full"
                        />
                        <div className="w-auto">
                            <strong className="block text-lg font-semibold">Sign Message</strong>
                            <span className="text-sm text-[#999999]">icpswap.com</span>
                        </div>
                    </div>
                    <div className="block py-2 text-sm text-[#999999]">{app?.title}</div>
                    <div className="block text-sm text-[#999999]">{approve_ic.origin}</div>
                    <div className="mt-4 w-full rounded-xl bg-[#181818] px-4 py-3">
                        <h3 className="block text-lg font-semibold">Message</h3>
                        <div className="block w-full break-words pt-2 text-sm text-[#999999]">
                            ispswap wants you to sign in with your icp account:
                            <br />
                            3RaqYYn8Q8VC2UtspaxSvLnZed8QAWAcyuPVou6pVy5P
                            <br />
                            wallet_sign_statement URI: https://icpswap.com
                            <br />
                            Version: 1<br />
                            Chain ID: 900
                            <br />
                            Nonce: b0ahyvfs
                            <br />
                            Issued At: 2025-03-06T01:27:36.157Z
                            <br />
                            Expiration Time: 2025-04-05T01:27:36.157Z
                        </div>
                    </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-x-3 p-5">
                    <Button
                        className="h-12 w-full rounded-xl bg-[#666666] text-lg font-semibold text-white"
                        onPress={() => onAction('deny')}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="h-12 w-full rounded-xl bg-[#FFCF13] text-lg font-semibold text-black"
                        onPress={() => onAction('approve')}
                    >
                        Approve
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ApproveIcActionPage;
