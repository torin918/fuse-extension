import CHAIN_IC_SVG from 'data-base64:~assets/svg/chains/ic.min.svg';

export interface ChainIcNetwork {
    chain: 'ic';
    name: string;
    created: number; // ms
    origin: string;
    label: string;
    logo: string;
}

export const CHAIN_IC_MAINNET: ChainIcNetwork = {
    chain: 'ic',
    name: 'Internet Computer Mainnet',
    created: 0, // inner, means mainnet
    origin: 'mainnet', // 'https://icp-api.io'
    label: 'Internet Computer',
    logo: CHAIN_IC_SVG,
};
