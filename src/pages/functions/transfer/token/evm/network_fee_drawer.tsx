// import { Button } from '@heroui/react';
import { useState } from 'react';
import { AiFillCar } from 'react-icons/ai';
import { BsLightning } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiBicycle } from 'react-icons/pi';

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
    {
        id: 4,
        // icon: 'icon-setting',
        icon: <IoSettingsOutline className="h-8 w-8 text-[#999]" />,
        name: 'Custom',
        time: '1 min',
        gwei: '0.90',
        from: '0.00001882ETH',
        to: '0.03',
        className: 'text-[#999]',
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
    // const toast = useSonnerToast();

    const [open, setOpen] = useState(false);

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
                    <div className="mt-3 h-full w-full">
                        <div className="mt-5 flex w-full flex-col gap-4">
                            {feeList.map((item, idx) => (
                                <div
                                    key={`${item.name}-${idx}`}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center rounded-xl border border-[#333] bg-[#0A0600] px-4 py-3 duration-300 hover:bg-[#333333]',
                                        current_free && current_free.id === item.id && 'border-[#FFCF13]',
                                        !current_free && item.id === 2 && 'border-[#FFCF13]',
                                    )}
                                    onClick={() => {
                                        setCurrentFee(item);
                                    }}
                                >
                                    <div className="mr-4 flex h-9 w-9 items-center justify-center">
                                        {item.icon}
                                        {/* <Icon name={item.icon} className={cn('h-8 w-8', item.className)} /> */}
                                    </div>
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
                        </div>
                    </div>

                    {/* <Button
                        className="h-[48px] bg-[#FFCF13] text-lg font-semibold text-black"
                        onPress={() => setOpen(false)}
                    >
                        Close
                    </Button> */}
                </div>
            </DrawerContent>
        </Drawer>
    );
};
