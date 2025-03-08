import { Button } from '@heroui/react';
import { useState } from 'react';

import InputPassword from '~components/input-password';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useSonnerToast } from '~hooks/toast';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsSecurityChangePasswordPage() {
    const toast = useSonnerToast();
    const current_state = useCurrentState();

    // const changePassword = useChangePassword();
    // changePassword('1111qqqq', 'qqqq1111').then((r) => {
    //     if (r === undefined) return;
    //     if (r === false) return;
    //     // notice successful
    // });

    const { setHide, goto } = useGoto();
    const [old_password, setOldPassword] = useState('');
    const [new_password, setNewPassword] = useState('');

    const confirm = () => {
        toast.success('Successfully set');
        goto(-1);
    };
    return (
        <FusePage current_state={current_state}>
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
                                onChange={() => setOldPassword(old_password)}
                            />
                        </div>
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">New Password</label>
                            <InputPassword
                                placeholder="At least 8 characters"
                                onChange={() => setNewPassword(new_password)}
                            />
                        </div>
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">Confirm New Password</label>
                            <InputPassword
                                placeholder="Confirm Password"
                                onChange={() => setNewPassword(new_password)}
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

export default FunctionSettingsSecurityChangePasswordPage;
