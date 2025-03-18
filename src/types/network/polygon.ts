import CHAIN_POL_SVG from 'data-base64:~assets/svg/chains/pol.min.svg';

export interface ChainPolygonNetwork {
    chain: 'polygon';
    chain_id: 137;
    name: string;
    created: number; // ms
    rpc: string;
    label: string;
    logo: string;
}

export const CHAIN_POLYGON_MAINNET: ChainPolygonNetwork = {
    chain: 'polygon',
    chain_id: 137,
    name: 'Polygon Mainnet',
    created: 0, // inner, means mainnet
    rpc: 'mainnet', // 'https://polygon-bor-rpc.publicnode.com'
    label: 'Polygon',
    logo: CHAIN_POL_SVG,
};
