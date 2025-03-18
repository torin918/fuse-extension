import { useEffect, useMemo, useState } from 'react';
import { RiAppsLine } from 'react-icons/ri';

import Icon from '~components/icon';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';
// import { get_local_current_select_network } from '~hooks/store/local';
import { useCurrentChainNetwork } from '~hooks/store/local-secure';
import { cn } from '~lib/utils/cn';
import { type Chain } from '~types/chain';

interface ChainItem {
    id: string;
    name: string;
    logo: React.ReactNode | string;
}

interface SelectChainProps {
    trigger?: React.ReactNode;
    container?: HTMLElement | null;
    selectedChain?: string;
    onSelectChain?: (chain: string | undefined) => void;
}

const SelectChain = ({ trigger, container, selectedChain = 'all-chain', onSelectChain }: SelectChainProps) => {
    const [open, setOpen] = useState(false);

    const current_chain_network = useCurrentChainNetwork();
    const [selectedNetwork, setSelectedNetwork] = useState<string | undefined>();

    useEffect(() => {
        if (!open) return;

        setSelectedNetwork(selectedChain);
    }, [selectedChain, open]);

    // useEffect(() => {
    //     if (!open) return;

    //     getCurrentChain();
    // }, [open, selectedChain]);

    // const getCurrentChain = () => {
    //     get_local_current_select_network().then((r) => setSelectedChain(r || 'all-chain'));
    // };

    const chains = useMemo(() => {
        const chains: ChainItem[] = [];
        chains.push({
            id: 'all-chain',
            name: 'All Chain',
            logo: (<RiAppsLine className="w-full h-full text-black" />) as unknown as React.ReactNode, // 这里需要替换为实际的图标路径
        });

        Object.entries(current_chain_network).map(([key, value]) => {
            chains.push({
                id: key as Chain,
                name: value.label,
                logo: value.logo,
            });
        });

        return chains;
    }, [current_chain_network]);

    const handleSelectChain = (chainItem: ChainItem) => {
        const chain = chainItem.id === 'all-chain' ? undefined : chainItem.id;

        onSelectChain?.(chain);
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerTrigger className="">{trigger}</DrawerTrigger>
            <DrawerContent className="!max-h-[90%]">
                <DrawerHeader className="border-t border-[#333333] bg-[#0a0600] text-left">
                    <DrawerTitle>
                        <div className="flex justify-between items-center py-3 w-full text-white">
                            <span className="text-sm">Select Chain</span>
                            <span
                                className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85"
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </span>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription />
                </DrawerHeader>
                <div className="w-full flex-1 overflow-y-auto bg-[#0a0600] px-5 pb-5">
                    {chains.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'my-2 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#333333] bg-[#0a0600] p-4 transition duration-300 hover:border-[#FFCF13]',
                                {
                                    'border-[#FFCF13]': item.id === selectedNetwork,
                                },
                            )}
                            onClick={() => handleSelectChain(item)}
                        >
                            <div className="flex items-center">
                                <div className="flex relative justify-center items-center mr-3 w-10 h-10 rounded-full">
                                    {typeof item.logo === 'string' && (
                                        <img src={item.logo} alt={item.name} className="w-10 h-10" />
                                    )}
                                    {typeof item.logo === 'object' && (
                                        <div className="h-10 w-10 rounded-full bg-[#FFCF13] p-2">{item.logo}</div>
                                    )}
                                </div>
                                <span className="text-base text-white">{item.name}</span>
                            </div>
                            {item.id === selectedNetwork && <Icon name="icon-ok" className="h-5 w-5 text-[#FFCF13]" />}
                        </div>
                    ))}
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default SelectChain;
