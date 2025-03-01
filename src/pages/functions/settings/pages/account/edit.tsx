import { useMemo, useState } from 'react';
import { useParams, type NavigateOptions } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityKeys } from '~hooks/store/local-secure';

import { SettingsHeader } from '../../components/header';

function FunctionSettingsAccountsSinglePage() {
    const current_state = useCurrentState();

    const { setHide, goto } = useGoto();

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <SettingsHeader
                        title={'Manage Account'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <InnerSingleAccountPage goto={goto} />
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsAccountsSinglePage;

const InnerSingleAccountPage = ({
    goto: _goto,
}: {
    goto: (path: string | number, options?: NavigateOptions) => void;
}) => {
    const { id } = useParams();

    const { current_identity, identity_list, showMnemonic, showPrivateKey, deleteIdentity, updateIdentity } =
        useIdentityKeys();

    const current = useMemo(() => {
        if (!current_identity || !identity_list) return undefined;
        return identity_list.find((identity) => identity.id === id);
    }, [id, current_identity, identity_list]);

    const [mnemonic, setMnemonic] = useState<string>();
    const [private_key, setPrivateKey] = useState<string>();

    if (!current || !identity_list) return <></>;
    return (
        <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                {current.icon}
            </div>
            <div>Account Name: {current.name}</div>
            <div>Account Address: {current.address.ic?.owner}</div>
            <div>Account Address: {current.address.ic?.account_id}</div>
            {current.key.type === 'mnemonic' && (
                <>
                    <div
                        onClick={() => {
                            showMnemonic(current.id, '1111qqqq1').then((m) => {
                                console.error('show mnemonic', m);
                                if (m === undefined) return;
                                if (m === false) setMnemonic('wrong password');
                                if (typeof m === 'object') setMnemonic(m.mnemonic);
                            });
                        }}
                    >
                        Show Mnemonic: {mnemonic}
                    </div>
                </>
            )}
            {current.key.type === 'private_key' && (
                <>
                    <div
                        onClick={() => {
                            showPrivateKey(current.id, '1111qqqq').then((pk) => {
                                console.error('show private key', pk);
                                if (pk === undefined) return;
                                if (pk === false) setPrivateKey('wrong password');
                                if (typeof pk === 'string') setPrivateKey(pk);
                            });
                        }}
                    >
                        Show Private Key: {private_key}
                    </div>
                </>
            )}

            <div
                onClick={() => {
                    updateIdentity(current.id, current.name + '1', current.icon).then((r) => {
                        console.error('update identity', r);
                        if (r === undefined) return;
                        if (r === false) throw new Error('can not update');
                        // notice successful
                    });
                }}
            >
                Set Name
            </div>
            {current.deletable && (
                <div
                    onClick={() => {
                        deleteIdentity(current.id, '1111qqqq').then((r) => {
                            console.error('delete identity', r);
                            if (r === undefined) return;
                            if (r === false) throw new Error('can not delete');
                            // notice successful
                            _goto(-1);
                        });
                    }}
                >
                    Remove Account
                </div>
            )}
        </div>
    );
};
