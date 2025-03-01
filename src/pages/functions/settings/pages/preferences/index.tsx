import { Switch } from '@heroui/react';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { SettingsGroup } from '../../components/group';
import { SettingsHeader } from '../../components/header';
import { SettingsItem } from '../../components/item';

function FunctionSettingsPreferencesPage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();
    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[60px]"
                setHide={setHide}
                header={
                    <SettingsHeader
                        title={'Preferences Settings'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <SettingsGroup className="mt-6 w-full px-5">
                    <SettingsItem
                        path={() => {
                            showToast('not implemented');
                        }}
                        title="Currency"
                        tip="USD"
                    />
                    <SettingsItem
                        path={() => {
                            showToast('not implemented');
                        }}
                        title="Language"
                        tip={`English`}
                    />
                </SettingsGroup>

                <SettingsGroup>
                    <SettingsItem
                        path={() => {
                            showToast('not implemented');
                        }}
                        title="Fuse wallet actions on web"
                        arrow={false}
                        right={
                            <div className="switch-xs">
                                <Switch defaultSelected color="success" size="sm"></Switch>
                            </div>
                        }
                    />
                </SettingsGroup>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsPreferencesPage;
