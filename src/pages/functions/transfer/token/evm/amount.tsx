import { isPrincipalText } from '@choptop/haw';
import { Button } from '@heroui/react';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatUnits, type Address } from 'viem';

import Icon from '~components/icon';
import { useERC20ReadContractBalanceOf } from '~hooks/evm/contracts/erc20/read';
import { useERC20Transfer } from '~hooks/evm/contracts/erc20/write';
import { useNativeBalance } from '~hooks/evm/native/read';
import { useNativeTransfer } from '~hooks/evm/native/write';
import type { GotoFunction } from '~hooks/memo/goto';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import { cn } from '~lib/utils/cn';
import { truncate_principal, truncate_text } from '~lib/utils/text';
import { format_number_smart } from '~pages/functions/token/evm';
import { match_chain, type Chain } from '~types/chain';
import { get_evm_token_info, type CurrentTokenShowInfo } from '~types/tokens';

import { NetworkFeeDrawer, type NetworkFee } from './network_fee_drawer';

const validate_transfer_amount = (amount: string, max_amount: BigNumber) => {
    const parsed_amount_bn = new BigNumber(amount);
    if (parsed_amount_bn.isNegative()) {
        throw new Error('Amount cannot be negative');
    }
    if (!parsed_amount_bn.isInteger()) {
        throw new Error('Amount is invalid');
    }
    if (parsed_amount_bn.gt(max_amount)) {
        throw new Error('Insufficient balance');
    }
    return parsed_amount_bn;
};
function FunctionTransferTokenEvmAmountPage({
    logo,
    to,
    goto: _goto,
    info,
}: {
    logo?: string;
    to?: Address;
    goto: GotoFunction;
    info: CurrentTokenShowInfo;
}) {
    const [amount, setAmount] = useState('0');
    const [hex, setHex] = useState('');
    const [showHexInput, setShowHexInput] = useState(false);
    // current token info
    const current_token = undefined;

    const showUsd = useMemo<string | undefined>(() => {
        if (current_token === undefined) return '0.00';
        if (!amount) return '0.00';
    }, [current_token, amount]);

    const [current_free, setCurrentFee] = useState<NetworkFee>();

    const sendRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        sendRef.current?.focus();
    }, [sendRef]);

    const freeFef = useRef<HTMLDivElement>(null);
    const { symbol, chain, isNative, decimals, address } = get_evm_token_info(info.token.info);
    const { current_identity_network } = useCurrentIdentity();
    const self = match_chain(chain, {
        ic: () => {
            throw new Error('IC chain is not supported');
        },
        ethereum: () => current_identity_network?.ethereum?.address,
        ethereum_test_sepolia: () => current_identity_network?.ethereum_test_sepolia?.address,
        polygon: () => current_identity_network?.polygon?.address,
        polygon_test_amoy: () => current_identity_network?.polygon_test_amoy?.address,
        bsc: () => current_identity_network?.bsc?.address,
        bsc_test: () => current_identity_network?.bsc_test?.address,
    });
    // balance
    const { data: erc20Balance } = useERC20ReadContractBalanceOf(chain, address, self && [self], {
        enabled: !!self && !isNative,
    });
    const { data: nativeBalance } = useNativeBalance(chain);

    const balance = isNative ? BigInt(nativeBalance ?? '0') : erc20Balance;
    const formatted_balance = format_number_smart(formatUnits(balance ?? BigInt(0), decimals));

    // parsed amount
    const parsed_amount = useMemo(() => {
        return new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed();
    }, [amount, decimals]);

    const [fee, setFee] = useState<string>('0');
    // native balance enough for (fee + native amount)
    const is_enough_native = useMemo(() => {
        return isNative
            ? BigNumber(nativeBalance?.toString() ?? '0')
                  .minus(BigNumber(fee ?? '0'))
                  .minus(BigNumber(parsed_amount ?? '0'))
                  .gte(0)
            : BigNumber(nativeBalance?.toString() ?? '0').gte(BigNumber(fee ?? '0'));
    }, [balance, fee, parsed_amount]);

    // max amount (native/erc20)
    const max_amount = useMemo(() => {
        const max_amount_bn = isNative
            ? BigNumber(balance?.toString() ?? '0').minus(new BigNumber(fee ?? '0'))
            : BigNumber(balance?.toString() ?? '0');
        if (max_amount_bn.isNegative()) return BigNumber(0);
        return max_amount_bn;
    }, [balance, fee, decimals]);

    // transfer
    const { mutateAsync: transfer_native, isPending: is_transferring_native } = useNativeTransfer(chain);
    const { transfer: transfer_erc20, isPending: is_transferring_erc20 } = useERC20Transfer(chain);
    const is_transferring = is_transferring_native || is_transferring_erc20;
    const onConfirm = useCallback(async () => {
        try {
            if (is_transferring) return;
            if (!to) return;
            if (!parsed_amount) return;
            if (!is_enough_native) throw new Error('Insufficient native balance');
            const parsed_amount_bn = validate_transfer_amount(parsed_amount, max_amount);
            if (isNative) {
                await transfer_native({ to, amount: BigInt(parsed_amount_bn.toFixed()) });
            } else {
                await transfer_erc20(address, to, BigInt(parsed_amount_bn.toFixed()));
            }
        } catch (error) {
            console.debug('🚀 ~ onConfirm ~ error:', error);
        }
    }, [is_transferring, to, parsed_amount, max_amount, transfer_native, is_enough_native]);

    if (!address || !to) return <></>;

    return (
        <div ref={freeFef} className="flex h-full w-full flex-col justify-between overflow-hidden">
            <div className="flex w-full flex-1 flex-col px-5">
                <div className="my-5 flex w-full justify-center">
                    <img
                        src={logo ?? 'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png'}
                        className="h-[50px] w-[50px] rounded-full"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            const regex = new RegExp(`^(0|[1-9]\\d*)(\\.\\d{0,${decimals}})?$`);
                            if (value === '' || value === '0' || value === '.' || regex.test(value)) {
                                setAmount(value);
                            }
                        }}
                        onBlur={() => {
                            if (amount.endsWith('.')) {
                                setAmount(amount.slice(0, -1));
                            }
                        }}
                        className="h-[48px] min-w-[50px] border-none bg-transparent pr-3 text-right text-5xl font-bold text-white outline-none"
                        style={{ width: `${amount.length + 1}ch` }}
                        ref={sendRef}
                    />
                    <span className="text-5xl font-bold text-white">{symbol}</span>
                </div>
                <span className="block w-full py-2 text-center text-base text-[#999999]">${showUsd}</span>
                <div className="flex items-center justify-center text-sm">
                    <span className="pr-2 text-[#999999]">Available:</span>
                    <span className="pr-3 text-[#EEEEEE]">{formatted_balance}</span>
                    <div
                        className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85"
                        onClick={() => {
                            setAmount(
                                BigNumber(balance?.toString() ?? '0')
                                    .div(2)
                                    .div(new BigNumber(10).pow(decimals))
                                    .toFixed(),
                            );
                        }}
                    >
                        50%
                    </div>
                    <div
                        className="cursor-pointer px-1 text-[#FFCF13] duration-300 hover:opacity-85"
                        onClick={() => {
                            const value = max_amount.div(new BigNumber(10).pow(decimals)).toFixed();
                            setAmount(value);
                            if (sendRef.current) {
                                sendRef.current.style.width = `${value.length + 1}ch`;
                            }
                        }}
                    >
                        Max
                    </div>
                </div>
                <div className="mt-7 w-full rounded-xl bg-[#181818]">
                    <div className="flex w-full justify-between border-b border-[#333333] px-3 py-4">
                        <span className="text-sm text-[#999999]">To</span>
                        <div className="flex items-center">
                            <span className="px-2 text-sm text-[#EEEEEE]">
                                {isPrincipalText(to) ? truncate_principal(to) : truncate_text(to)}
                            </span>
                            <Icon
                                name="icon-copy"
                                className="h-[14px] w-[14px] cursor-pointer text-[#EEEEEE] duration-300 hover:text-[#FFCF13]"
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col border-b border-[#333333] px-3 py-4">
                        <div className="text-sm text-[#999999]">Network Fee</div>
                        <NetworkFeeDrawer
                            current_free={current_free}
                            setCurrentFee={setCurrentFee}
                            trigger={
                                <div className="mt-3 flex w-full cursor-pointer items-center justify-between gap-x-3">
                                    <div className="flex-1">
                                        <div className="flex w-full items-center gap-2 text-sm text-[#eee]">
                                            <img
                                                src={
                                                    logo ??
                                                    'https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png'
                                                }
                                                className="h-4 w-4 rounded-full"
                                            />
                                            <span>Average | 0.00001937ETH($0.03697)</span>
                                        </div>
                                        <div className="mt-2 text-left text-sm text-[#999]">
                                            Maximum 0.00002247 ETH(S0.0429)
                                        </div>
                                    </div>
                                    <div className={cn('text-xs text-[#999] hover:text-[#FFCF13]')}>
                                        <Icon
                                            name="icon-arrow-right"
                                            className="h-3 w-3 cursor-pointer text-[#999999]"
                                        />
                                    </div>
                                </div>
                            }
                            container={freeFef.current}
                        />
                    </div>
                    <div className="flex w-full flex-col px-3 py-4">
                        <div className="flex w-full items-center justify-between text-sm text-[#999999]">
                            <div>HEX data (optional)</div>
                            <div
                                className={cn(
                                    'rotate-90 cursor-pointer text-xs text-[#EEEEEE] transition-all hover:text-[#FFCF13]',
                                    showHexInput && '-rotate-90',
                                )}
                                onClick={() => setShowHexInput(!showHexInput)}
                            >
                                <Icon name="icon-arrow-right" className="h-3 w-3 cursor-pointer text-[#999999]" />
                            </div>
                        </div>
                        <div className={cn('mt-3', showHexInput ? 'block' : 'hidden')}>
                            <input
                                type="text"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                                className="h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-2 text-sm text-[#EEEEEE] outline-none duration-300 placeholder:text-[#999999] hover:border-[#FFCF13] focus:border-[#FFCF13]"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full p-5">
                <Button
                    className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                    // isDisabled={
                    //     !amount ||
                    //     new BigNumber(amount).lte(new BigNumber(0)) ||
                    //     new BigNumber(showBalance ?? '0').lt(new BigNumber(amount).plus(new BigNumber(showFee ?? '0')))
                    // }
                    onPress={onConfirm}
                    isLoading={is_transferring}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
}

export default FunctionTransferTokenEvmAmountPage;
