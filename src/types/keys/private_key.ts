export interface IdentityKeyPrivate {
    type: 'private_key';
    private_key: string;
    chain: 'ethereum' | 'solana';
}
