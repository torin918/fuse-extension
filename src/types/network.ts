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

// =================== chain identity network ===================

export interface ChainIcIdentityNetwork {
    chain: 'ic';
    owner: string;
    network: ChainIcNetwork;
}

export type IdentityNetwork = ChainIcIdentityNetwork;

export const get_identity_network_key = (identity_network: IdentityNetwork): string => {
    return match_chain(identity_network.chain, {
        ic: () => `${identity_network.chain}:${identity_network.owner}:${identity_network.network.origin}`,
    });
};

// current
export interface CurrentIdentityNetwork {
    ic?: ChainIcIdentityNetwork;
}
