import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { showToast } from '~components/toast';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useMarkedAddresses, useRecentAddresses } from '~hooks/store/local-secure';
import { truncate_principal, truncate_text } from '~lib/utils/text';

import { FunctionHeader } from '../../../components/header';
import { AddAddress } from './components/modal';

function FunctionSettingsAddressesPage() {
    const current_address = useCurrentState();

    const { setHide, goto } = useGoto();

    const [markedAddresses, , { pushOrUpdateMarkedAddress, removeMarkedAddress }] = useMarkedAddresses();
    const [recentAddresses, , { pushRecentAddress }] = useRecentAddresses();

    // TODO test
    const pushRandomMarked = useCallback(() => {
        const initialAddresses = [
            {
                id: '1',
                name: 'Mac Chrome',
                addr: 'aaaaa-aa',
                isVisible: false,
            },
            {
                id: '2',
                name: 'Windows Chrome',
                addr: '64ufaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe341a',
                isVisible: false,
            },
            {
                id: '3',
                name: 'Linux Chrome',
                addr: '73jdfa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c7483he0a',
                isVisible: false,
            },
        ];
        const address = initialAddresses[Math.floor(Math.random() * initialAddresses.length)];
        pushOrUpdateMarkedAddress({ type: 'ic', address: address.addr }, address.name).then((d) => {
            console.error('push marked address', d);
        });
    }, [pushOrUpdateMarkedAddress]);

    // TODO test
    const pushRandomRecent = useCallback(() => {
        const history_address = [
            '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
            'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
            '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
            'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
            '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
            'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
            '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        ];
        const address = history_address[Math.floor(Math.random() * history_address.length)];
        pushRecentAddress({ type: 'ic', address }).then((d) => {
            console.error('push recent address', d);
        });
    }, [pushRecentAddress]);

    const [isAddrOpen, setIsOpen] = useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
            // setAddresses((prevAddresses) => prevAddresses.map((address) => ({ ...address, isVisible: false })));
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure();
    console.assert(onOpen); // TODO test

    return (
        <FusePage current_state={current_address}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Addresses'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <button onClick={pushRandomMarked}>push marked</button>
                <button onClick={pushRandomRecent}>push recent</button>

                <div className="flex h-full flex-col justify-between">
                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full px-5">
                            {markedAddresses.map((item) => (
                                <div
                                    key={`${JSON.stringify(item.address)}`}
                                    className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333333] p-2 text-xl font-bold">
                                                {item.address.address.charAt(0)}
                                            </div>
                                            <div className="pl-3">
                                                <span className="block text-sm font-semibold">{item.name}</span>
                                                <span className="block text-xs text-[#999999]">
                                                    {item.address.address.includes('-')
                                                        ? truncate_principal(item.address.address)
                                                        : truncate_text(item.address.address)}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="dropdown-container relative flex h-8 w-8 items-center justify-center rounded-lg duration-300 hover:bg-[#2B2B2B]"
                                            onClick={() => {
                                                // const updatedAddresses = [...addresses];
                                                // updatedAddresses[index].isVisible = !updatedAddresses[index].isVisible;
                                                // setAddresses(updatedAddresses);
                                            }}
                                        >
                                            <span className="h-[3px] w-[3px] rounded-full bg-[#999999]"></span>
                                            <span className="mx-[2px] h-[3px] w-[3px] rounded-full bg-[#999999]"></span>
                                            <span className="h-[3px] w-[3px] rounded-full bg-[#999999]"></span>
                                            {
                                                <div className="absolute right-0 top-9 z-50 w-[120px] rounded-xl bg-[#222222] p-2">
                                                    <CopyToClipboard
                                                        text={item.address.address}
                                                        onCopy={() => {
                                                            showToast('Copied', 'success');
                                                        }}
                                                    >
                                                        <div className="flex items-center rounded-lg p-2 duration-300 hover:bg-[#333333]">
                                                            <Icon
                                                                name="icon-copy"
                                                                className="mr-2 h-3 w-3 shrink-0 cursor-pointer text-[#999999]"
                                                            ></Icon>
                                                            <span>Copy</span>
                                                        </div>
                                                    </CopyToClipboard>
                                                    <div
                                                        className="flex items-center rounded-lg p-2 duration-300 hover:bg-[#333333]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setIsOpen(true);
                                                        }}
                                                    >
                                                        <Icon
                                                            name="icon-edit"
                                                            className="mr-2 h-4 w-4 shrink-0 cursor-pointer text-[#999999]"
                                                        ></Icon>
                                                        <span>Edit</span>
                                                    </div>
                                                    <div
                                                        className="flex items-center rounded-lg p-2 duration-300 hover:bg-[#333333]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeMarkedAddress(item.address);
                                                        }}
                                                    >
                                                        <Icon
                                                            name="icon-delete"
                                                            className="mr-2 h-4 w-4 shrink-0 cursor-pointer text-[#999999]"
                                                        ></Icon>
                                                        <span>Delete</span>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full">
                            <h2 className="font-xs px-5 pb-2 pt-5 text-[#999999]">Recent Address</h2>
                            {recentAddresses.map((item, index) => (
                                <div
                                    key={index + JSON.stringify(item)}
                                    className="flex items-center justify-between px-5"
                                >
                                    <div className="flex-1 cursor-pointer break-all py-2 text-xs text-[#EEEEEE]">
                                        {item.address.address}
                                    </div>
                                    <div onClick={() => setIsOpen(true)}>
                                        <Icon
                                            name="icon-add"
                                            className="ml-4 h-4 w-4 shrink-0 cursor-pointer text-[#FFCF13] duration-300 hover:opacity-80"
                                        ></Icon>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full p-5">
                        <Button
                            className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                            onPress={() => setIsOpen(true)}
                        >
                            Add
                        </Button>
                    </div>
                    <AddAddress isOpen={isAddrOpen} setIsOpen={setIsOpen} />
                    <Modal
                        backdrop="blur"
                        isOpen={isOpen}
                        onClose={onClose}
                        size="xs"
                        placement="center"
                        hideCloseButton={true}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalBody>
                                        <div className="flex w-full flex-col items-center justify-center pt-5">
                                            <Icon name="icon-tips" className="h-[56px] w-[56px] text-[#FFCF13]" />
                                            <p className="w-full pt-4 text-base">
                                                Are you sure you want to delete the address?
                                            </p>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <div className="grid w-full grid-cols-2 gap-x-4">
                                            <Button
                                                className="rounded-xl bg-[#666666] py-3 text-base text-[#EEEEEE]"
                                                onPress={onClose}
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                className="rounded-xl bg-[#FFCF13] py-3 text-base font-semibold text-black"
                                                onPress={onClose}
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsAddressesPage;
