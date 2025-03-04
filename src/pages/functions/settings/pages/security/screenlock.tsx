import { useState } from 'react';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsScreenLock() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();

    const [selectedId, setSelectedId] = useState(1);
    const customTimes = [
        { id: 1, expired: '10 minutes' },
        { id: 2, expired: '30 minutes' },
        { id: 3, expired: '1 hours' },
        { id: 4, expired: '4 hours' },
        { id: 5, expired: '8 hours' },
        { id: 6, expired: '12 hours' },
    ];

    const confirm = (item: { id: any; expired?: string }) => {
        setSelectedId(item.id);
        showToast('Successfully set', 'success');
        goto(-1);
    };
    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Screen Lock'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="w-full px-5">
                    <div className="mt-8 w-full overflow-hidden rounded-xl bg-[#181818]">
                        {customTimes.map((item, index) => (
                            <div
                                key={index}
                                className="flex w-full cursor-pointer items-center justify-between border-b border-[#222222] px-4 py-3 text-sm duration-300 hover:bg-[#333333]"
                                onClick={() => {
                                    confirm(item);
                                }}
                            >
                                <span className="text-sm">{item.expired}</span>
                                {selectedId === item.id && <Icon name="icon-ok" className="h-5 w-5 text-[#FFCF13]" />}
                            </div>
                        ))}
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsScreenLock;
