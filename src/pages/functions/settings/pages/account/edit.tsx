import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityList } from '~hooks/store/local-secure';

import { SettingsHeader } from '../../components/header';

function FunctionSettingsAccountsSinglePage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();

    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="w-full pt-[60px]"
                setHide={setHide}
                header={
                    <SettingsHeader
                        title={'Manage Account'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <InnerSingleAccountPage />
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsAccountsSinglePage;

const InnerSingleAccountPage = () => {
    const { id } = useParams();

    console.debug(`🚀 ~ FunctionSettingsAccountsSinglePage ~ params:`, id);

    const { current_identity, identity_list } = useIdentityList();

    const current = useMemo(() => {
        if (!current_identity || !identity_list) return undefined;
        return identity_list.find((identity) => identity.id === id);
    }, [id, current_identity, identity_list]);

    if (!current) return <></>;
    return (
        <div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                {current.icon}
            </div>
            <div>Account Name: {current.name}</div>
            <div>Account Address: {current.address.ic?.owner}</div>
            <div>Account Address: {current.address.ic?.account_id}</div>
        </div>
    );
};
