import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useUserSettingsIdle } from '~hooks/store';
import { useChangePassword, useIdentityKeys } from '~hooks/store/local-secure';

import { FunctionHeader } from '../../../components/header';
import { SettingsGroup } from '../../components/group';
import { SettingsItem } from '../../components/item';

function FunctionSettingsSecurityPage() {
    const current_state = useCurrentState();

    const { setHide, goto } = useGoto();

    const [idle, setIdle] = useUserSettingsIdle();

    const { main_mnemonic_identity, showMnemonic } = useIdentityKeys();

    const changePassword = useChangePassword();

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Security & Privacy'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <SettingsGroup className="mt-6 w-full px-5">
                    {/* <SettingsItem
                        path={() => {
                            changePassword('1111qqqq', 'qqqq1111').then((r) => {
                                if (r === undefined) return;
                                if (r === false) return;
                                // notice successful
                            });
                        }}
                        title="Change Password"
                    /> */}
                    <SettingsItem path={'/home/settings/security/changepwd'} title="Change Password" />
                    {/* <SettingsItem
                        path={() => {
                            setIdle(1000 * 60 * 15);
                            // show modal
                        }}
                        title="Screen Lock"
                        tip={`${idle}ms`}
                    /> */}
                    <SettingsItem path={'/home/settings/security/screenlock'} title="Screen Lock" tip={`${idle}ms`} />
                </SettingsGroup>

                {main_mnemonic_identity && (
                    <SettingsGroup>
                        {/* <SettingsItem
                            path={() => {
                                showMnemonic(main_mnemonic_identity, '1111qqqq').then((m) => {
                                    console.error('show mnemonic', m);
                                    if (m === undefined) return;
                                    if (m === false) throw new Error('wrong password');
                                    // show mnemonic
                                });
                            }}
                            title="Backup Seed Phrase"
                        /> */}
                        <SettingsItem path={'/home/settings/security/backup'} title="Backup Seed Phrase" />
                    </SettingsGroup>
                )}
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsSecurityPage;
