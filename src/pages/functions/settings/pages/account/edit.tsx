import { Button, Drawer, DrawerBody, DrawerContent, useDisclosure } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams, type NavigateOptions } from 'react-router-dom';

import Icon from '~components/icon';
import InputPassword from '~components/input-password';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { usePasswordHashed } from '~hooks/store';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { verify_password } from '~lib/password';
import { cn } from '~lib/utils/cn';
import { truncate_text } from '~lib/utils/text';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsAccountsSinglePage() {
    const current_state = useCurrentState();

    const { setHide, goto } = useGoto();

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Manage Account'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <InnerSingleAccountPage goto={goto} />
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsAccountsSinglePage;

const InnerSingleAccountPage = ({
    goto: _goto,
}: {
    goto: (path: string | number, options?: NavigateOptions) => void;
}) => {
    const { id } = useParams();

    const { current_identity, identity_list, showMnemonic, showPrivateKey, deleteIdentity, updateIdentity } =
        useIdentityKeys();

    const current = useMemo(() => {
        if (!current_identity || !identity_list) return undefined;
        return identity_list.find((identity) => identity.id === id);
    }, [id, current_identity, identity_list]);

    const [mnemonic, setMnemonic] = useState<string>();
    const [private_key, setPrivateKey] = useState<string>();

    const [isOpenRemove, setIsOpenRemove] = useState(false);
    const removeAccount = async (id: string) => {
        const r = await deleteIdentity(id, '1111qqqq');
        console.error('delete identity', r);
        if (r === undefined) return;
        if (r === false) throw new Error('can not delete');
        // notice successful
        _goto(-1);
    };

    const [isOpenSeedPhrase, setIsOpenSeedPhrase] = useState(false);
    const showSeedPhrase = (id: string) => {
        showMnemonic(id, '1111qqqq').then((m) => {
            console.error('show mnemonic', m);
            if (m === undefined) return;
            if (m === false) setMnemonic('wrong password');
            if (typeof m === 'object') setMnemonic(m.mnemonic);
        });
    };

    const [isOpenPrivatekey, setIsOpenPrivateKey] = useState(false);
    const showPrivate = (id: string) => {
        showPrivateKey(id, '1111qqqq').then((pk) => {
            console.error('show private key', pk);
            if (pk === undefined) return;
            if (pk === false) setPrivateKey('wrong password');
            if (typeof pk === 'string') setPrivateKey(pk);
        });
    };

    const [isOpenAvatar, setIsOpenAvatar] = useState(false);
    const [isOpenAccountName, setIsOpenAccountName] = useState(false);

    if (!current || !identity_list) return <></>;
    return (
        <div className="w-full px-5">
            <div className="flex items-center justify-center py-7">
                <div className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#333333] text-4xl">
                    {current.icon}
                    <div
                        className="absolute -right-2 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#0A0600] bg-[#333333]"
                        onClick={() => {
                            setIsOpenAvatar(true);
                        }}
                    >
                        <Icon
                            name="icon-edit"
                            className="h-3 w-3 cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full overflow-hidden rounded-xl bg-[#181818]">
                <div className="flex cursor-pointer items-center justify-between border-b border-[#222222] px-4 py-3 duration-300 hover:bg-[#333333]">
                    <span className="text-sm text-[#EEEEEE]">Account Name</span>
                    <div
                        className="flex items-center justify-between"
                        onClick={() => {
                            setIsOpenAccountName(true);
                        }}
                    >
                        <span className="text-sm text-[#999999]">{current.name}</span>
                        <Icon name="icon-arrow-right" className="ml-3 h-3 w-3 text-[#999999]" />
                    </div>
                </div>
                <div className="flex items-center justify-between border-b border-[#222222] px-4 py-3">
                    <span className="text-sm text-[#EEEEEE]">Principal ID</span>
                    <CopyToClipboard
                        text={current.address.ic?.owner}
                        onCopy={() => {
                            showToast('Copied', 'success');
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#999999]">
                                {truncate_text(current.address.ic?.owner || '')}
                            </span>
                            <Icon
                                name="icon-copy"
                                className="ml-3 h-3 w-3 cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    </CopyToClipboard>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-[#EEEEEE]">Account ID</span>
                    <CopyToClipboard
                        text={current.address.ic?.account_id}
                        onCopy={() => {
                            showToast('Copied', 'success');
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#999999]">
                                {truncate_text(current.address.ic?.account_id || '')}
                            </span>
                            <Icon
                                name="icon-copy"
                                className="ml-3 h-3 w-3 cursor-pointer text-[#999999] duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    </CopyToClipboard>
                </div>
            </div>

            <div className="mt-4 w-full overflow-hidden rounded-xl bg-[#181818]">
                <div
                    className="flex cursor-pointer items-center justify-between border-b border-[#222222] px-4 py-3 duration-300 hover:bg-[#333333]"
                    onClick={() => {
                        setIsOpenSeedPhrase(true);
                    }}
                >
                    <span className="text-sm text-[#EEEEEE]">Backup Seed Phrase</span>
                    <Icon name="icon-arrow-right" className="ml-3 h-3 w-3 text-[#999999]" />
                </div>
                <div
                    className="flex cursor-pointer items-center justify-between px-4 py-3 duration-300 hover:bg-[#333333]"
                    onClick={() => {
                        setIsOpenPrivateKey(true);
                    }}
                >
                    <span className="text-sm text-[#EEEEEE]">Backup Private Key</span>
                    <Icon name="icon-arrow-right" className="ml-3 h-3 w-3 text-[#999999]" />
                </div>
            </div>

            {current.deletable && (
                <div className="mt-4 w-full overflow-hidden rounded-xl bg-[#181818]">
                    <span
                        className="block cursor-pointer px-4 py-3 text-sm text-[#FF2C40] duration-300 hover:opacity-85"
                        onClick={() => {
                            setIsOpenRemove(true);
                        }}
                    >
                        Remove Account
                    </span>
                </div>
            )}
            <RemoveAccount
                isOpen={isOpenRemove}
                setIsOpen={setIsOpenRemove}
                onDelete={() => removeAccount(current.id)}
            />

            <Backup
                isOpen={isOpenSeedPhrase}
                setIsOpen={setIsOpenSeedPhrase}
                onShowSeed={() => showSeedPhrase(current.id)}
                mnemonic={mnemonic}
                type="seed"
            />

            <Backup
                isOpen={isOpenPrivatekey}
                setIsOpen={setIsOpenPrivateKey}
                onShowSeed={() => showPrivate(current.id)}
                mnemonic={private_key}
                type="private"
            />
            {/* {current.key.type === 'private_key' && (
                <>
                    <div
                        onClick={() => {
                            showPrivateKey(current.id, '1111qqqq').then((pk) => {
                                console.error('show private key', pk);
                                if (pk === undefined) return;
                                if (pk === false) setPrivateKey('wrong password');
                                if (typeof pk === 'string') setPrivateKey(pk);
                            });
                        }}
                    >
                        Show Private Key: {private_key}
                    </div>
                </>
            )} */}
            <SetName isOpen={isOpenAccountName} setIsOpen={setIsOpenAccountName} />
            {/* <div
                onClick={() => {
                    updateIdentity(current.id, current.name + '1', current.icon).then((r) => {
                        console.error('update identity', r);
                        if (r === undefined) return;
                        if (r === false) throw new Error('can not update');
                        // notice successful
                    });
                }}
            >
                Set Name
            </div> */}
            <SetAvatar isOpen={isOpenAvatar} setIsOpen={setIsOpenAvatar} />
        </div>
    );
};

const RemoveAccount = ({
    isOpen,
    setIsOpen,
    onDelete,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onDelete: () => Promise<void>;
}) => {
    const { onOpenChange } = useDisclosure();

    const handleClose = async () => {
        try {
            await onDelete();
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="mt-8 flex w-full flex-col items-center justify-center py-10">
                            <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#271511]">
                                <Icon name="icon-remove" className="h-10 w-10 text-[#FF2C40]" />
                            </div>
                            <div className="w-full py-3 text-center text-lg text-[#FF2C40]">
                                Confirm removal of wallet1?
                            </div>
                            <p className="block text-center text-sm text-[#FFCF13]">
                                Even if you delete this wallet, you can still restore the account using the mnemonic
                                phrase or private key of this wallet.
                            </p>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <Button
                                className="h-[48px] w-full text-lg font-semibold text-black"
                                onPress={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                                onPress={handleClose}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

type BackupType = 'seed' | 'private';
const Backup = ({
    isOpen,
    setIsOpen,
    onShowSeed,
    mnemonic,
    type,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onShowSeed: () => void;
    mnemonic?: string;
    type: BackupType;
}) => {
    const { onOpenChange } = useDisclosure();
    const [valid, setValid] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password_hashed] = usePasswordHashed();
    useEffect(() => {
        (async () => {
            if (!password1) return false;
            if (!password_hashed) return false;
            return verify_password(password_hashed, password1);
        })().then(setValid);
    }, [password1, password_hashed]);

    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm">
                                {type === 'seed' ? 'Backup Seed Phrase' : 'Backup Private Key'}
                            </span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                        {mnemonic && valid ? (
                            <div className="flex-1 overflow-y-auto">
                                <div className="mb-4 mt-2 block rounded-xl bg-[#2E1D01] px-4 py-3 text-sm text-[#FFCF13]">
                                    For security, we recommend that you manually back it up and store it safely.
                                </div>
                                {type === 'seed' ? (
                                    <div className="mt-5 grid w-full grid-cols-2 rounded-xl border border-[#333333]">
                                        {mnemonic.split(' ').map((word, index) => (
                                            <span
                                                key={index}
                                                className={cn(
                                                    `styled-word flex h-[52px] items-center border-[#333333] text-base text-[#EEEEEE]`,
                                                    index % 2 === 1 ? 'border-b border-r-0' : 'border-b border-r',
                                                    index + 1 > 10 ? 'border-b-0' : '',
                                                )}
                                            >
                                                <i className="ml-3 mr-2 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#333333] text-center text-xs not-italic text-[#999999]">
                                                    {index + 1}
                                                </i>
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-5 w-full rounded-xl border border-[#333333]">
                                        <p className="block h-[120px] break-words p-3 text-sm">{mnemonic}</p>
                                        <CopyToClipboard
                                            text={mnemonic}
                                            onCopy={() => {
                                                showToast('Copied', 'success');
                                            }}
                                        >
                                            <div className="flex w-full cursor-pointer items-center justify-center border-t border-[#333333] py-3 duration-300 hover:opacity-85">
                                                <Icon name="icon-copy" className="mr-2 h-3 w-3 text-[#FFCF13]" />
                                                <span className="text-sm text-[#FFCF13]">Copy</span>
                                            </div>
                                        </CopyToClipboard>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full flex-1">
                                <div className="mt-8 flex w-full flex-col items-center justify-center">
                                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#2E1D01]">
                                        <Icon name="icon-warning" className="h-10 w-10 text-[#FFA000]" />
                                    </div>
                                    <p className="block py-5 text-center text-sm text-[#FFCF13]">
                                        Your seed phrase is the only way to recover your wallet. Do not let anyone see
                                        it.
                                    </p>
                                    <div className="mt-5 w-full">
                                        <label className="block pb-3 text-sm">Your Password</label>
                                        <InputPassword
                                            placeholder="Enter your Password"
                                            onChange={setPassword1}
                                            errorMessage={!password1 || valid ? undefined : 'password is mismatch'}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {mnemonic && valid ? (
                            <Button
                                className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                                onPress={() => setIsOpen(false)}
                            >
                                I have recorded it
                            </Button>
                        ) : (
                            <Button
                                className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                                onPress={onShowSeed}
                            >
                                Confirm
                            </Button>
                        )}
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

const SetName = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { onOpenChange } = useDisclosure();
    const [name, setName] = useState('');
    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm">Account Name</span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto pt-8">
                            <input
                                type="text"
                                placeholder="Wallet Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm text-[#EEEEEE] outline-none duration-300 hover:border-[#FFCF13] focus:border-[#FFCF13]"
                            />
                        </div>
                        <Button
                            className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                            isDisabled={name.length < 1}
                        >
                            Confirm
                        </Button>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

const SetAvatar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { onOpenChange } = useDisclosure();
    const [name, setName] = useState('');
    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm">Account Name</span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex items-center justify-center py-6">
                                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#333333] text-4xl">
                                    😄
                                </div>
                            </div>
                            <p className="block w-full text-center text-sm">Choose Your Favorite Emoji</p>
                            <div className="pt-5">emoji</div>
                        </div>
                        <div className="w-full pt-5">
                            <Button className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black">
                                Confirm
                            </Button>
                        </div>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
