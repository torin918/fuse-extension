import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentState } from '~hooks/memo/current_state';
import { useRestoreAccount } from '~hooks/memo/restore_account';
import { useNavigatePages } from '~hooks/navigate';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

import InputPasswordPage from './pages/password';
import RestoreMnemonicPage from './pages/restore_mnemonic';
import RestorePrivateKeyPage from './pages/restore_private_key';
import RestoreWayPage from './pages/restore_way';

type RestoreState = 'way' | 'mnemonic' | 'private_key' | 'password';

function CreateRestorePage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();
    useNavigatePages(current_state, false); // can go back

    const navigate = useNavigate();

    const { restoreAccountByMnemonic } = useRestoreAccount(current_state);

    const [state, setState] = useState<RestoreState>('way');
    const [last_state, setLastState] = useState<'mnemonic' | 'private_key'>();

    const [mnemonic, setMnemonic] = useState('');

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const onCompleted = useCallback(async () => {
        await restoreAccountByMnemonic(password1, mnemonic);
        if (wt === 'options') {
            await chrome.action.openPopup();
            // window.close(); // close window if current window is individual page
        }
    }, [password1, mnemonic, restoreAccountByMnemonic, wt]);

    if (current_state !== CurrentState.INITIAL && current_state !== CurrentState.LOCKED) return <></>;
    return (
        <>
            {/* Import Wallet - Select the way to import the wallet */}
            {state === 'way' && (
                <RestoreWayPage
                    onBack={() => navigate(-1)}
                    onNext={(way) => {
                        setLastState(way);
                        setState(way);
                    }}
                />
            )}

            {/* Import wallet - Mnemonics */}
            {state === 'mnemonic' && (
                <RestoreMnemonicPage
                    onBack={() => setState('way')}
                    mnemonic={mnemonic}
                    setMnemonic={setMnemonic}
                    onNext={() => setState('password')}
                />
            )}

            {/* Import the wallet - private key */}
            {state === 'private_key' && (
                <RestorePrivateKeyPage onBack={() => setState('way')} onNext={() => setState('password')} />
            )}

            {/* Password Creation Wallet */}
            {state === 'password' && (
                <InputPasswordPage
                    onBack={() => setState(last_state ?? 'way')}
                    password1={password1}
                    setPassword1={setPassword1}
                    password2={password2}
                    setPassword2={setPassword2}
                    onNext={onCompleted}
                />
            )}
        </>
    );
}

export default CreateRestorePage;
