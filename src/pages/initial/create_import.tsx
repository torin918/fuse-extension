import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
// import { useRestoreAccount } from '~hooks/memo/restore_account';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { validate_mnemonic } from '~lib/mnemonic';
import type { CombinedIdentityKey } from '~types/identity';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

import RestoreMnemonicPage from './pages/restore_mnemonic';
import RestorePrivateKeyPage from './pages/restore_private_key';

type ImportCreateState = 'mnemonic' | 'private_key';

function CreateImportPage({ wt, extra }: { wt: WindowType; extra?: boolean }) {
    const current_state = useCurrentState();

    const navigate = useNavigate();
    const { type } = useParams<{ type: ImportCreateState }>();
    // remove prod
    console.debug('🚀 ~ CreateImportPage ~ type:', type);

    // const { restoreAccountByMnemonic } = useRestoreAccount(current_state);
    const { isKeyExist, pushIdentity } = useIdentityKeys();

    const [state, setState] = useState<ImportCreateState>('mnemonic');
    const [importWalletLoading, setImportWalletLoading] = useState<boolean>(false);

    const [mnemonic, setMnemonic] = useState('');

    useEffect(() => {
        if (type === undefined) {
            setState('mnemonic');
            return;
        }
        if (type === 'mnemonic') setState('mnemonic');
        if (type === 'private_key') setState('private_key');

        return () => {
            setMnemonic('');
            setState('mnemonic');
        };
    }, [type]);

    const onMnemonicCompleted = useCallback(async () => {
        if (importWalletLoading) return;

        setImportWalletLoading(true);

        if (!mnemonic || !validate_mnemonic(mnemonic)) return;

        if (extra) {
            const key: CombinedIdentityKey = {
                mnemonic: {
                    type: 'mnemonic',
                    mnemonic,
                    subaccount: 0,
                },
            };
            isKeyExist(key).then((exist) => {
                if (exist) throw new Error('key already exists');
                pushIdentity(key).then((r) => {
                    if (r === undefined) throw Error('push identity failed');
                    if (r === false) throw new Error('push identity failed');

                    setImportWalletLoading(false);
                    navigate(-3); // back 3 pages
                });
            });
            return;
        }

        // await restoreAccountByMnemonic(password1, mnemonic);
        if (wt === 'options') {
            await chrome.action.openPopup();
            // window.close(); // close window if current window is individual page
        }
    }, [extra, mnemonic, isKeyExist, pushIdentity, wt, navigate, importWalletLoading]);

    const onPrivateKeyCompleted = useCallback(async () => {
        throw new Error('unimplemented');

        // if (importWalletLoading) return;

        // setImportWalletLoading(true);

        // setTimeout(() => {
        //     setImportWalletLoading(false);
        // }, 2000);
    }, []);

    return (
        <FusePage
            current_state={current_state}
            states={extra ? CurrentState.ALIVE : [CurrentState.INITIAL, CurrentState.LOCKED]}
        >
            {/* Import wallet - Mnemonics */}
            {state === 'mnemonic' && (
                <RestoreMnemonicPage
                    onBack={() => navigate(-1)}
                    mnemonic={mnemonic}
                    setMnemonic={setMnemonic}
                    onNext={() => onMnemonicCompleted()}
                    isLoading={importWalletLoading}
                />
            )}

            {/* Import the wallet - private key */}
            {state === 'private_key' && (
                <RestorePrivateKeyPage
                    onBack={() => navigate(-1)}
                    onNext={() => onPrivateKeyCompleted()}
                    isLoading={importWalletLoading}
                />
            )}
        </FusePage>
    );
}

export default CreateImportPage;
