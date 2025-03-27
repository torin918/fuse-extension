// import { Button } from '@heroui/react';
import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';
import { AiFillCar } from 'react-icons/ai';
import { BsLightning } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiBicycle, PiWarningCircle } from 'react-icons/pi';

import InputCustom from '~components/input-custom';
import { Checkbox } from '~components/ui/checkbox';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';
// import { useSonnerToast } from '~hooks/toast';
import { cn } from '~lib/utils/cn';

export interface NetworkFee {
    id: number;
    icon: string | React.ReactNode;
    name: string;
    time: string;
    gwei: string;
    from: string;
    to: string;
    className?: string;
}

const feeList: NetworkFee[] = [
    {
        id: 1,
        // icon: 'icon-slow',
        icon: <PiBicycle className="h-8 w-8 text-[#F15A24]" />,
        name: 'Slow',
        time: '1 min',
        gwei: '0.90',
        from: '0.00001882ETH',
        to: '0.03',
        className: 'text-[#F15A24]',
    },
    {
        id: 2,
        icon: <AiFillCar className="h-8 w-8 text-[#32B1FB]" />,
        name: 'Average',
        time: '30 sec',
        gwei: '0.90',
        from: '0.00001882ETH',
        to: '0.03',
        className: 'text-[#32B1FB]',
    },
    {
        id: 3,
        // icon: 'icon-fast',
        icon: <BsLightning className="h-8 w-8 text-[#07C160]" />,
        name: 'Fast',
        time: '15 sec',
        gwei: '2.40',
        from: '0.00001882ETH',
        to: '0.03',
        className: 'text-[#07C160]',
    },
];

export const NetworkFeeDrawer = ({
    trigger,
    container,
    current_free,
    setCurrentFee,
}: {
    trigger: React.ReactNode;
    container?: HTMLElement | null;
    current_free: NetworkFee | undefined;
    setCurrentFee: (fee: NetworkFee) => void;
}) => {
    const custom = {
        id: 4,
        icon: <IoSettingsOutline className="h-8 w-8 text-[#999]" />,
        name: 'Custom',
        time: '< 30 sec',
        gwei: '0.90',
        from: '0.00001882ETH',
        to: '0.03',
        priorityFee: '0.50',
        maxFee: '0.50',
        gasLimit: '21000',
    };
    const [open, setOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);

    useEffect(() => {
        return () => {
            setShowCustom(false);
        };
    }, [open]);

    const checkFee = (item: NetworkFee) => {
        setCurrentFee(item);

        if (item.id === 4) {
            setShowCustom(true);
            return;
        }
        setShowCustom(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerTrigger>{trigger}</DrawerTrigger>
            <DrawerContent
                className="flex h-full !max-h-full w-full flex-col items-center justify-between border-0 bg-transparent pt-[50px]"
                overlayClassName="bg-black/50"
            >
                <DrawerHeader className="w-full shrink-0 border-t border-[#333333] bg-[#0a0600] px-5 pb-0 pt-1 text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm text-white">Network Fee</span>
                            <DrawerClose>
                                <span className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85">
                                    Close
                                </span>
                            </DrawerClose>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription className="hidden" />
                </DrawerHeader>

                <div className="flex h-full w-full shrink flex-col justify-between bg-[#0a0600] px-5 pb-5">
                    <div className="mt-3 h-full w-full overflow-y-auto pb-10">
                        <div className="mt-5 flex w-full flex-col gap-4">
                            {feeList.map((item, idx) => (
                                <div
                                    key={`${item.name}-${idx}`}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center rounded-xl border border-[#333] bg-[#0A0600] px-4 py-3 duration-300 hover:bg-[#333333]',
                                        current_free && current_free.id === item.id && 'border-[#FFCF13]',
                                        !current_free && item.id === 2 && 'border-[#FFCF13]',
                                    )}
                                    onClick={() => checkFee(item)}
                                >
                                    <div className="mr-4 flex h-9 w-9 items-center justify-center">{item.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex w-full justify-between">
                                            <div className="text-base text-[#EEEEEE]">{item.name}</div>
                                            <p className="text-base text-[#eee]">{item.time}</p>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <div className="text-xs text-[#999]">{item.gwei}Gwei</div>
                                            <p className="text-xs text-[#999999]">
                                                {item.from}≈${item.to}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div
                                className={cn(
                                    'flex w-full cursor-pointer flex-col rounded-xl border border-[#333] bg-[#0A0600] px-4 py-3 duration-300',
                                    current_free && current_free.id === 4 && 'border-[#FFCF13]',
                                )}
                                onClick={() => checkFee(custom)}
                            >
                                <div className="flex w-full cursor-pointer items-center">
                                    <div className="mr-4 flex h-9 w-9 items-center justify-center">{custom.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex w-full justify-between">
                                            <div className="text-base text-[#EEEEEE]">{custom.name}</div>
                                            <p className="text-base text-[#eee]">{custom.time}</p>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <div className="text-xs text-[#999]">{custom.gwei}Gwei</div>
                                            <p className="text-xs text-[#999999]">
                                                {custom.from}≈${custom.to}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {showCustom && (
                                    <div className="mt-2 w-full border-t border-[#333]">
                                        <div className="mt-2 w-full">
                                            <div className="flex w-full items-center justify-between text-sm text-[#eee]">
                                                <div>Max base fee</div>
                                                <div className="text-xs text-[#999]">
                                                    Base fee required: <span className="text-#eee">{custom.gwei}</span>{' '}
                                                    Gwei
                                                </div>
                                            </div>
                                            <InputCustom
                                                className="mt-2"
                                                extra={<div className="text-xs text-[#999]">Gwei</div>}
                                                initValue={custom.maxFee}
                                                onChange={(value) => {
                                                    custom.maxFee = value;
                                                }}
                                                placeholder="Max base fee"
                                            />
                                        </div>

                                        <div className="mt-2 w-full">
                                            <div className="flex w-full items-center justify-between text-sm text-[#eee]">
                                                <div>Priority fee</div>
                                            </div>
                                            <InputCustom
                                                className="mt-2"
                                                extra={<div className="text-xs text-[#999]">Gwei</div>}
                                                initValue={custom.priorityFee}
                                                onChange={(value) => {
                                                    custom.priorityFee = value;
                                                }}
                                                placeholder="Priority fee"
                                            />
                                        </div>

                                        <div className="mt-2 w-full">
                                            <div className="flex w-full items-center justify-between text-sm text-[#eee]">
                                                <div>Gas limit</div>
                                            </div>
                                            <InputCustom
                                                className="mt-2"
                                                initValue={custom.gasLimit}
                                                onChange={(value) => {
                                                    custom.gasLimit = value;
                                                }}
                                                placeholder="Max base fee"
                                            />
                                        </div>

                                        <div className="mt-3 flex w-full items-center space-x-2">
                                            <Checkbox id="terms" className="border-[#333]" />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Set as default for all future transactions onEthereum
                                            </label>
                                        </div>

                                        <div className="mt-3 w-full">
                                            <Button
                                                className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                                                disabled={!custom.gasLimit || !custom.maxFee || !custom.priorityFee}
                                                onPress={() => setShowCustom(false)}
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {showCustom && (
                            <div className="mt-2 flex items-center justify-start gap-x-2 text-sm text-[#333]">
                                <div className="flex h-5 w-5 items-center">
                                    <PiWarningCircle className="h-5 w-5 text-[#999]" />
                                </div>
                                <div className="text-[#eee]">
                                    The estimated network fee may increase if network conditions change.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
