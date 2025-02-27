export type Chain = 'ic';

export const match_chain = <T>(self: Chain, { ic }: { ic: () => T }): T => {
    if (self === 'ic') return ic();
    throw new Error(`unknown chain: ${self}`);
};

export const match_chain_async = async <T>(self: Chain, { ic }: { ic: () => Promise<T> }): Promise<T> => {
    if (self === 'ic') return ic();
    throw new Error(`Unknown chain: ${self}`);
};
