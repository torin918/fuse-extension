import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    useDisclosure,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import Icon from '~components/icon';
import { showToast } from '~components/toast';
import { truncate_principal, truncate_text } from '~lib/utils/text';

const AddAddress = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    const { onOpenChange } = useDisclosure();
    const [addrName, setAddrName] = useState<string>('');
    const [customAddress, setCustomAddress] = useState<string>('');
    return (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerBody>
                    <div className="fixed bottom-0 left-0 top-[60px] z-20 flex w-full flex-col justify-between border-t border-[#333333] bg-[#0a0600] px-5 pb-5">
                        <div className="w-full">
                            <div className="flex w-full items-center justify-between py-3">
                                <span className="text-sm">Add Address</span>
                                <span
                                    className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Close
                                </span>
                            </div>
                            <div className="mt-5 w-full">
                                <div className="w-full">
                                    <label className="block py-3 text-sm">Name</label>
                                    <input
                                        type="text"
                                        className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm outline-none transition duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                                        placeholder="Enter a name under 20 characters"
                                        onChange={(e) => setAddrName(e.target.value)}
                                        value={addrName}
                                    />
                                </div>
                                <div className="mt-3 w-full">
                                    <label className="block py-3 text-sm">Address</label>
                                    <textarea
                                        className="w-full resize-none rounded-xl border border-[#333333] bg-transparent px-3 py-3 text-sm outline-none transition duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                                        placeholder="Enter Principal ID or Account ID"
                                        onChange={(e) => setCustomAddress(e.target.value)}
                                        value={customAddress}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="h-[48px] bg-[#FFCF13] text-lg font-semibold text-black"
                            isDisabled={!addrName || !customAddress}
                            onPress={() => setIsOpen(false)}
                        >
                            Add
                        </Button>
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

function AddressPage() {
    const initialAddresses = [
        {
            id: '1',
            name: 'Mac Chrome',
            addr: 'wqofe-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-eid',
            isVisible: false,
        },
        {
            id: '2',
            name: 'Windows Chrome',
            addr: '64ufaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe341',
            isVisible: false,
        },
        {
            id: '3',
            name: 'Linux Chrome',
            addr: '73jdfa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c7483he0',
            isVisible: false,
        },
    ];

    const history_address = [
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
        'uyrhg-t23vc-bl6pv-6obcp-dyhpe-pajbm-3ssmz-kn4u4-rrois-3kqsj-cqe',
        '87bbaa4b0a2683a6cfa80cc6594a0b8605b61950ec3f6b7360eb569c74fe3413',
    ];

    const [isAddrOpen, setIsOpen] = useState(false);
    const [addresses, setAddresses] = useState(initialAddresses);

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
            setAddresses((prevAddresses) => prevAddresses.map((address) => ({ ...address, isVisible: false })));
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="relative flex h-[calc(100vh-60px)] flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
                <div className="w-full px-5">
                    {addresses.map((add, index) => (
                        <div key={index} className="mt-3 block w-full cursor-pointer rounded-xl bg-[#181818] p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333333] p-2 text-xl font-bold">
                                        {add.addr.charAt(0)}
                                    </div>
                                    <div className="pl-3">
                                        <span className="block text-sm font-semibold">{add.name}</span>
                                        <span className="block text-xs text-[#999999]">
                                            {add.addr.includes('-')
                                                ? truncate_principal(add.addr)
                                                : truncate_text(add.addr)}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="dropdown-container relative flex h-8 w-8 items-center justify-center rounded-lg duration-300 hover:bg-[#2B2B2B]"
                                    onClick={() => {
                                        const updatedAddresses = [...addresses];
                                        updatedAddresses[index].isVisible = !updatedAddresses[index].isVisible;
                                        setAddresses(updatedAddresses);
                                    }}
                                >
                                    <span className="h-[3px] w-[3px] rounded-full bg-[#999999]"></span>
                                    <span className="mx-[2px] h-[3px] w-[3px] rounded-full bg-[#999999]"></span>
                                    <span className="h-[3px] w-[3px] rounded-full bg-[#999999]"></span>
                                    {add.isVisible && (
                                        <div className="absolute right-0 top-9 z-50 w-[120px] rounded-xl bg-[#222222] p-2">
                                            <CopyToClipboard
                                                text={add.addr}
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
                                                    setAddresses((prevAddresses) =>
                                                        prevAddresses.map((address) => ({
                                                            ...address,
                                                            isVisible: false,
                                                        })),
                                                    );
                                                    onOpen();
                                                }}
                                            >
                                                <Icon
                                                    name="icon-delete"
                                                    className="mr-2 h-4 w-4 shrink-0 cursor-pointer text-[#999999]"
                                                ></Icon>
                                                <span>Delete</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full">
                    <h2 className="font-xs px-5 pb-2 pt-5 text-[#999999]">Recent Address</h2>
                    {history_address.map((address, index) => (
                        <div className="flex items-center justify-between px-5">
                            <div key={index} className="flex-1 cursor-pointer break-all py-2 text-xs text-[#EEEEEE]">
                                {address}
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
            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="xs" placement="center" closeButton={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <div className="flex w-full flex-col items-center justify-center pt-5">
                                    <Icon name="icon-tips" className="h-[52px] w-[52px] text-[#FFCF13]" />
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
                                        Action
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AddressPage;
