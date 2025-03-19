import CHAIN_ETH_SVG from 'data-base64:~assets/svg/chains/eth.min.svg';

export interface ChainEthereumNetwork {
    chain: 'ethereum';
    chain_id: 1;
    name: string;
    created: number; // ms
    rpc: string;
    label: string;
    logo: string;
}

export const CHAIN_ETHEREUM_MAINNET: ChainEthereumNetwork = {
    chain: 'ethereum',
    chain_id: 1,
    name: 'Ethereum Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'mainnet', // 'https://eth.merkle.io'
    label: 'Ethereum',
    logo: CHAIN_ETH_SVG,
};
