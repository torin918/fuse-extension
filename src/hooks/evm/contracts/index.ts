import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
    type Abi,
    type Account,
    type Address,
    type Chain,
    type ContractFunctionArgs,
    type ContractFunctionName,
    type Hash,
    type WriteContractParameters,
} from 'viem';

import { useEvmWalletClientCreator } from '~hooks/store/local-secure';
import type { EvmChain } from '~types/chain';
import { get_identity_network_key } from '~types/network';

import { SHOULD_DEHYDRATE_QUERY_KEY, useEvmChainIdentityNetworkByChain, usePublicClientByChain } from '../viem';

export interface UseReadContractConfig<
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi, 'pure' | 'view'>,
> {
    chain: EvmChain;
    address: Address;
    abi: TAbi;
    functionName: TFunctionName;
    args?: ContractFunctionArgs<TAbi, 'pure' | 'view', TFunctionName>;
    queryOptions?: Omit<UseQueryOptions, 'queryFn' | 'queryKey'>;
}
// need to de-hydrate query
const SHOULD_DEHYDRATE_QUERY_FUNCTION_NAME = ['balanceOf', 'aggregate3'];
export const useReadContract = <
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi, 'pure' | 'view'>,
>(
    config: UseReadContractConfig<TAbi, TFunctionName>,
) => {
    const { chain, address, abi, functionName, args, queryOptions } = config;
    const client = usePublicClientByChain(chain);
    const identity_network = useEvmChainIdentityNetworkByChain(chain);
    const identity_key = identity_network && get_identity_network_key(identity_network);
    const queryKey = identity_key
        ? [
              identity_key,
              'contract',
              address,
              functionName,
              args,
              SHOULD_DEHYDRATE_QUERY_FUNCTION_NAME.includes(functionName) ? SHOULD_DEHYDRATE_QUERY_KEY : undefined,
          ]
        : [];
    const enabled = !!client && !!(!queryOptions || queryOptions.enabled);
    return useQuery({
        queryKey,
        queryFn: async () => {
            if (!client) throw new Error('Client is required');
            return client.readContract({
                address,
                abi,
                functionName,
                args,
            });
        },
        enabled,
    });
};

export const useTransactionReceipt = ({ chain, hash }: { chain: EvmChain; hash?: Hash }) => {
    const identity_network = useEvmChainIdentityNetworkByChain(chain);
    const identity_key = identity_network && get_identity_network_key(identity_network);
    const client = usePublicClientByChain(chain);
    const queryKey = identity_key ? [identity_key, 'contract'] : [];
    const enabled = !!client && !!hash;
    return useQuery({
        queryKey,
        queryFn: async () => {
            if (!client) throw new Error('Client is required');
            if (!hash) throw new Error('Hash is required');
            return client.getTransactionReceipt({
                hash,
            });
        },
        enabled,
        refetchInterval: 10 * 60,
    });
};

export const useWriteContract = <
    TAbi extends Abi | readonly unknown[],
    TFunctionName extends ContractFunctionName<TAbi, 'payable' | 'nonpayable'>,
    TArgs extends ContractFunctionArgs<TAbi, 'payable' | 'nonpayable', TFunctionName>,
    TChainOverride extends Chain | undefined = undefined,
>(
    chain: EvmChain,
) => {
    const create_wallet_client = useEvmWalletClientCreator(chain);
    const identity_network = useEvmChainIdentityNetworkByChain(chain);
    const identity_key = identity_network && get_identity_network_key(identity_network);
    const mutationKey = useMemo(() => {
        if (!identity_key) return [];
        return [identity_key, 'contract', 'write'];
    }, [identity_key]);

    return useMutation({
        mutationKey,
        mutationFn: async (
            params: WriteContractParameters<TAbi, TFunctionName, TArgs, Chain, Account, TChainOverride>,
        ) => {
            const client = create_wallet_client();
            if (!client) throw new Error('Client is required');
            return client.writeContract(params);
        },
    });
};
