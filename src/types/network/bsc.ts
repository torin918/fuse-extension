import CHAIN_BSC_SVG from 'data-base64:~assets/svg/chains/bsc.min.svg';

export interface ChainBscNetwork {
    chain: 'bsc';
    chain_id: 56;
    name: string;
    created: number; // ms
    rpc: string;
    label: string;
    logo: string;
}

export const CHAIN_BSC_MAINNET: ChainBscNetwork = {
    chain: 'bsc',
    chain_id: 56,
    name: 'Bsc Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'mainnet', // 'https://bsc-rpc.publicnode.com'
    label: 'BNB Smart Chain',
    logo: CHAIN_BSC_SVG,
};
