import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

import logo_svg from '~assets/svg/logo.svg';
import { useCurrentState } from '~hooks/memo/current_state';
import { useNavigatePages } from '~hooks/navigate';
import { cn } from '~lib/utils/cn';
import type { WindowType } from '~types/pages';
import { CurrentState } from '~types/state';

function InitialPage({ wt }: { wt: WindowType }) {
    const current_state = useCurrentState();
    useNavigatePages(current_state, false); // can go back

    const navigate = useNavigate();

    if (current_state !== CurrentState.INITIAL) return <></>;
    return (
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
    );
}

export default InitialPage;
