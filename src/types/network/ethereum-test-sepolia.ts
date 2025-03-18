import CHAIN_ETH_SVG from 'data-base64:~assets/svg/chains/eth.min.svg';

export interface ChainEthereumTestSepoliaNetwork {
    chain: 'ethereum-test-sepolia';
    chain_id: 11155111;
    name: string;
    created: number; // ms
    rpc: string;
    label: string;
    logo: string;
}

export const CHAIN_ETHEREUM_TEST_SEPOLIA_MAINNET: ChainEthereumTestSepoliaNetwork = {
    chain: 'ethereum-test-sepolia',
    chain_id: 11155111,
    name: 'Ethereum Test Sepolia Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'mainnet', // 'https://ethereum-sepolia-rpc.publicnode.com'
    label: 'Ethereum Test Sepolia',
    logo: CHAIN_ETH_SVG,
};
