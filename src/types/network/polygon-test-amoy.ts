import CHAIN_POL_SVG from 'data-base64:~assets/svg/chains/pol.min.svg';

export interface ChainPolygonTestAmoyNetwork {
    chain: 'polygon-test-amoy';
    chain_id: 80002;
    name: string;
    created: number; // ms
    rpc: string;
    label: string;
    logo: string;
}

export const CHAIN_POLYGON_TEST_AMOY_MAINNET: ChainPolygonTestAmoyNetwork = {
    chain: 'polygon-test-amoy',
    chain_id: 80002,
    name: 'Polygon Test Amoy Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'mainnet', // 'https://polygon-amoy-bor-rpc.publicnode.com'
    label: 'Polygon Test Amoy',
    logo: CHAIN_POL_SVG,
};
