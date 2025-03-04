import { Button } from '@heroui/react';
import { useState } from 'react';

import InputPassword from '~components/input-password';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsChangePwdPage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');

    const confirm = () => {
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
                        title={'Change Password'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="flex h-full w-full flex-col justify-between px-5">
                    <div className="flex-1">
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">Old Password</label>
                            <InputPassword
                                placeholder="Enter old password"
                                onChange={() => setOldPassword(oldpassword)}
                            />
                        </div>
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">New Password</label>
                            <InputPassword
                                placeholder="At least 8 characters"
                                onChange={() => setNewPassword(newpassword)}
                            />
                        </div>
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">Confirm New Password</label>
                            <InputPassword
                                placeholder="Confirm Password"
                                onChange={() => setNewPassword(newpassword)}
                            />
                        </div>
                    </div>
                    <div className="py-5">
                        <Button
                            className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                            // isDisabled={}
                            onPress={confirm}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsChangePwdPage;
