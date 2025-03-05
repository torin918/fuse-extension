import { useState } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsBackup() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();

    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Backup Seed Phrase'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="h-full w-full overflow-y-auto px-5">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-4 duration-300 hover:bg-[#2B2B2B]">
                            <div className="flex items-center justify-between">
                                <div className="flex cursor-default items-center">
                                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#333333] p-2 text-2xl">
                                        😄
                                    </div>
                                    <span className="pl-3 text-sm">Wallet 1</span>
                                </div>
                                <Icon name="icon-arrow-right" className="h-3 w-3 cursor-pointer text-[#999999]" />
                            </div>
                        </div>
                    ))}
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsBackup;
