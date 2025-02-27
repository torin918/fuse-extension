import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentState } from '~hooks/memo/current_state';
import { useRestoreAccount } from '~hooks/memo/restore_account';
import { useNavigatePages } from '~hooks/navigate';
import { random_mnemonic } from '~lib/mnemonic';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

import CreateMnemonicPage from './pages/create_mnemonic';
import CreateVerificationPage from './pages/create_verification';
import InputPasswordPage from './pages/password';

type CreateState = 'password' | 'mnemonic' | 'verification';

function InnerCreatePage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();
    useNavigatePages(current_state, false); // can go back

    const navigate = useNavigate();

    const { restoreAccountByMnemonic } = useRestoreAccount(current_state);

    const [state, setState] = useState<CreateState>('password');

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const [mnemonic12, setMnemonic12] = useState(random_mnemonic(12));
    const [mnemonic24, setMnemonic24] = useState(random_mnemonic(24));

    const [current_mnemonic, setCurrentMnemonic] = useState('');

    const onCompleted = useCallback(async () => {
        if (!current_mnemonic) return;
        await restoreAccountByMnemonic(password1, current_mnemonic);
        if (wt === 'options') {
            await chrome.action.openPopup();
            // window.close(); // close window if current window is individual page
        }
    }, [password1, current_mnemonic, restoreAccountByMnemonic, wt]);

    if (current_state !== CurrentState.INITIAL) return <></>;
    return (
        <>
            {state === 'password' && (
                <InputPasswordPage
                    onBack={() => navigate(-1)}
                    password1={password1}
                    setPassword1={setPassword1}
                    password2={password2}
                    setPassword2={setPassword2}
                    onNext={() => setState('mnemonic')}
                />
            )}
            {state === 'mnemonic' && (
                <CreateMnemonicPage
                    onBack={() => setState('password')}
                    mnemonic12={mnemonic12}
                    setMnemonic12={setMnemonic12}
                    mnemonic24={mnemonic24}
                    setMnemonic24={setMnemonic24}
                    onNext={(mnemonic) => {
                        setCurrentMnemonic(mnemonic);
                        setState('verification');
                    }}
                />
            )}
            {state === 'verification' && (
                <CreateVerificationPage
                    onBack={() => setState('mnemonic')}
                    mnemonic={current_mnemonic}
                    onNext={onCompleted}
                />
            )}
        </>
    );
}

export default InnerCreatePage;
