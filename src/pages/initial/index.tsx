import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

import logo_black from '~assets/svg/logo-black.svg';
import logo_svg from '~assets/svg/logo.svg';
import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { useCurrentState } from '~hooks/memo/current_state';
import { cn } from '~lib/utils/cn';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

function InitialPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();

    const navigate = useNavigate();

    return (

        <div
            className={cn(
                `flex h-full w-full items-center justify-center`,
                wt === 'options' ? 'h-screen bg-[#fef4ca]' : '',
            )}
        >
            {wt === 'options' && (
                <div className="fixed left-0 top-6 flex w-full items-center justify-between px-10">
                    <img src={logo_black} className="mr-2 w-[120px]" />
                    <div className="flex items-center">
                        <Icon name="icon-tips" className="mr-1 h-4 w-4 text-[#333333]" />
                        <span className="text-base text-[#333333]">Help</span>
                    </div>
                </div>
            )}
            <div
                className={cn(
                    wt === 'options' ? 'h-[520px] w-[400px] rounded-2xl bg-[#0a0600] shadow-2xl' : 'h-full w-full',
                )}
            >
                <div className="flex h-full flex-col justify-between px-5 pb-5">
                    <div className="flex w-full flex-1 flex-col items-center justify-center">
                        <img src={logo_svg} width={80} />
                        <p className="py-5 text-lg font-semibold text-[#FECE13]">Connect Your On-Chain World</p>
                    </div>
        <FusePage current_state={current_state} states={CurrentState.INITIAL}>
            <div className={cn(`flex h-full w-full items-center justify-center`, wt === 'options' ? 'h-screen' : '')}>
                <div className="h-full w-full">
                    <div className="flex h-full flex-col justify-between px-5 pb-5">
                        <div className="flex w-full flex-1 flex-col items-center justify-center">
                            <img src={logo_svg} width={80} />
                            <p className="py-5 text-lg font-semibold text-[#FECE13]">Your Gateway to the Web3 World</p>
                        </div>

                        <div className="flex w-full flex-col gap-y-5">
                            <Button
                                className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                                onPress={() => navigate('/initial/create')}
                            >
                                Create a new wallet
                            </Button>
                            <Button
                                className="h-[48px] w-full border border-[#FFCF13] bg-transparent text-lg font-semibold text-yellow-500 hover:bg-yellow-300 hover:text-black"
                                onPress={() => navigate('/initial/restore')}
                            >
                                Import an existing wallet
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </FusePage>
    );
}

export default InitialPage;
