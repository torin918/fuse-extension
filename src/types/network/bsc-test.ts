import CHAIN_BSC_SVG from 'data-base64:~assets/svg/chains/bsc.min.svg';

export interface ChainBscTestNetwork {
    chain: 'bsc-test';
    chain_id: 97;
    name: string;
    created: number; // ms
    rpc: string;
    label: string;
    logo: string;
}

export const CHAIN_BSC_TEST_MAINNET: ChainBscTestNetwork = {
    chain: 'bsc-test',
    chain_id: 97,
    name: 'BSC Test Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'mainnet', // 'https://bsc-testnet-rpc.publicnode.com'
    label: 'BSC Test',
    logo: CHAIN_BSC_SVG,
};
