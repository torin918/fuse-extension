import { match_chain } from './chain';

export interface ChainIcNetwork {
    chain: 'ic';
    origin: string;
    created: number; // ms
    name: string;
}

export const CHAIN_IC_MAINNET: ChainIcNetwork = {
    chain: 'ic',
    origin: 'https://icp-api.io',
    created: 0, // inner
    name: 'Internet Computer Mainnet',
};

export type ChainNetwork = ChainIcNetwork;
export type ChainNetworks = ChainNetwork[]; // user added networks

export interface CurrentChainNetwork {
    ic: ChainIcNetwork;
}

export const DEFAULT_CURRENT_CHAIN_NETWORK: CurrentChainNetwork = { ic: CHAIN_IC_MAINNET };

export const get_chain_network_key = (network: ChainNetwork): string => {
    return match_chain(network.chain, { ic: () => `${network.chain}:${network.origin}` });
};
