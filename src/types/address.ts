export type AddressType = 'ic' | 'evm';

export interface Address {
    type: AddressType;
    address: string; // principal or account id if ic,
}

export interface RecentAddress {
    created: string;
    address: Address;
}

export type RecentAddresses = RecentAddress[];

export interface MarkedAddress {
    created: number;
    updated: number;
    name: string;
    address: Address;
}

export type MarkedAddresses = MarkedAddress[];
