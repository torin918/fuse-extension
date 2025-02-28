import { Button } from '@heroui/react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useIdentityList } from '~hooks/store/local-secure';

import { SettingsHeader } from '../components/header';

function FunctionSettingsAccountsPage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();

    const { current_identity, identity_list } = useIdentityList();

    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="w-full pt-[60px]"
                setHide={setHide}
                header={
                    <SettingsHeader
                        title={'Manage Accounts'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="flex h-[calc(100vh-60px)] flex-col justify-between">
                    <div className="flex-1 overflow-y-auto px-5">
                        {(identity_list ?? []).map((identity) => (
                            <div
                                key={identity.id}
                                className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-4 duration-300 hover:bg-[#2B2B2B]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                                            {identity.icon}
                                        </div>
                                        <span className="pl-3 text-sm">{identity.name}</span>
                                    </div>
                                    {identity.id === current_identity && <div>CURRENT</div>}
                                    <Icon
                                        name="icon-arrow-right"
                                        className="h-[9px] w-[14px] cursor-pointer text-[#999999]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full p-5">
                        <Button className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black">
                            Add wallet
                        </Button>
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsAccountsPage;
