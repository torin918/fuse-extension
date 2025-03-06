import { anonymous, isCanisterIdText } from '@choptop/haw';
import { Button } from '@heroui/react';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';
import { get_cached_data } from '~hooks/store';
import { get_token_info_ic } from '~hooks/store/local/token/ic/info';
import { icrc1_logo } from '~lib/canisters/icrc1';
import type { IcTokenInfo } from '~types/tokens/ic';
import { get_token_logo_key } from '~types/tokens/preset';

const CustomTokenDrawer = ({
    trigger,
    container,
    isTokenExist,
    pushIcToken,
}: {
    trigger: React.ReactNode;
    container?: HTMLElement | null;
    isTokenExist: (token: { ic: string }) => boolean;
    pushIcToken: (token: IcTokenInfo) => Promise<void>;
}) => {
    const [open, setOpen] = useState(false);

    const [address, setAddress] = useState<string>('');

    const isCanisterId = useMemo(() => isCanisterIdText(address), [address]);

    const isExist = useMemo(() => {
        if (isCanisterId) return isTokenExist({ ic: address });
        return false;
    }, [isCanisterId, isTokenExist, address]);

    const [ic_token, setIcToken] = useState<IcTokenInfo>();

    const [pushing, setPushing] = useState(false);

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
                            <span className="text-sm text-white">Add Custom Token</span>
                            <DrawerClose>
                                <span className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85">
                                    Close
                                </span>
                            </DrawerClose>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription className="hidden"></DrawerDescription>
                </DrawerHeader>

                <div className="flex h-full w-full shrink flex-col justify-between bg-[#0a0600] px-5 pb-5">
                    <div className="mt-3 h-full w-full">
                        <div className="w-full">
                            <label className="block py-3 text-sm">Canister ID</label>
                            <input
                                type="text"
                                className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm outline-none transition duration-300 hover:border-[#FFCF13] focus:border-[#FFCF13]"
                                placeholder="Enter canister id"
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                        </div>
                        <div className="mt-4 w-full">
                            {!isCanisterId && !address && <div> </div>}
                            {!isCanisterId && address && <div className="text-red-500"> Wrong Canister Id </div>}
                            {isCanisterId && (
                                <LoadCanisterInfo canister_id={address} token={ic_token} setToken={setIcToken} />
                            )}
                        </div>
                    </div>

                    <Button
                        className="h-[48px] shrink-0 bg-[#FFCF13] text-lg font-semibold text-black"
                        isDisabled={!isCanisterId || !ic_token || isExist}
                        onPress={() => {
                            if (isCanisterId && !ic_token) return;
                            if (pushing) return;
                            if (isCanisterId && ic_token) {
                                setPushing(true);
                                pushIcToken(ic_token)
                                    .then(() => setOpen(false))
                                    .finally(() => setPushing(false));
                            }
                        }}
                    >
                        Add Token
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CustomTokenDrawer;

const LoadCanisterInfo = ({
    canister_id,
    token,
    setToken,
}: {
    canister_id: string;
    token: IcTokenInfo | undefined;
    setToken: (token: IcTokenInfo | undefined) => void;
}) => {
    const [logo, setLogo] = useState<string>();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (token?.canister_id === canister_id) return;
        setToken(undefined);
        setError('');
        setLoading(true);
        get_token_info_ic(canister_id)
            .then((t) => {
                if (t) {
                    setToken(t);
                    // try to cached logo
                    icrc1_logo(anonymous, canister_id).then((logo) => {
                        if (logo) {
                            setLogo(logo);
                            const key = get_token_logo_key({ ic: { canister_id } });
                            get_cached_data(key, async () => logo);
                        }
                    });
                } else setError('Not found');
            })
            .finally(() => setLoading(false));
    }, [token, canister_id, setToken]);
    return (
        <div className="text-sm">
            {loading && <div className="flex w-full items-center justify-center text-sm opacity-50">Loading...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {token && (
                <div className="w-full">
                    {logo && (
                        <div className="text-sm">
                            <img src={logo} className="h-10 w-10 rounded-full" />
                        </div>
                    )}
                    <div className="text-sm">Name: {token.name}</div>
                    <div className="text-sm">Symbol: {token.symbol}</div>
                    <div className="text-sm">Decimals: {token.decimals}</div>
                    <div className="text-sm">
                        Fee:
                        {BigNumber(token.fee)
                            .dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals)))
                            .toFixed()}
                    </div>
                    {0 < token.standards.length && (
                        <div className="flex flex-row justify-start gap-1 text-sm">
                            Standards:
                            {token.standards.map((s) => (
                                <span key={s}>{s.toUpperCase()}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
