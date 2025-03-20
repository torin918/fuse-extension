import { v4 as uuid } from 'uuid';
import { hexToNumber } from 'viem';

import { get_chain_by_chain_id } from '~hooks/evm/viem';
import { relay_message_get_address } from '~lib/messages/relay/relay-get-address';
import { relay_message_is_connected } from '~lib/messages/relay/relay-is-connected';
import { relay_message_request_connect } from '~lib/messages/relay/relay-request-connect';
import { isInpageMessage, isProviderEventMessage, type AnyFuseWalletMessage } from '~lib/messages/window';
import { match_chain } from '~types/chain';

import { DEFAULT_TIMEOUT, get_current_window } from '.';
import { find_favicon } from '../connect';
import { DEFAULT_CURRENT_CHAIN_EVM_NETWORK, type ChainEvmNetwork } from '../network/index';

export interface IsEvmConnectedRequest {
    timeout?: number;
    chainId?: `0x${string}`;
}
export type IsEvmConnectedResponse = boolean;

/**
 * Multi-chain OKX Wallet Provider
 * Extends EIP-1193 standard to support multi-chain operations
 */
export class FuseClientByEvm {
    // Identifier
    public readonly isFuseWallet: boolean = true;

    // Compatible with MetaMask
    public readonly isMetaMask: boolean = false;

    // Currently connected accounts (each address can connect to multiple chains)
    private _accounts: Record<string, string[]> = {};

    // Current active chain ID
    private _activeChainId = '0x1' as `0x${string}`; // Default Ethereum mainnet

    // List of added chains
    private _chains: Record<string, ChainEvmNetwork> = {
        '0x1': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.ethereum,
        '0xaa36a7': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.ethereum_test_sepolia,
        '0x89': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.polygon,
        '0x13882': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.polygon_test_amoy,
        '0x38': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.bsc,
        '0x61': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.bsc_test,
    };

    // Connection status
    private _isConnected = false;

    // Event listeners storage
    private _eventListeners: Record<string, ((payload: any) => void)[]> = {
        connect: [],
        disconnect: [],
        chainChanged: [],
        accountsChanged: [],
        message: [],
    };

    // (chainId -> address[])
    private _connectedAddresses: string[] = [];

    constructor() {
        // Initialize empty accounts record
        this._accounts = {};

        // Set up message handlers
        this._setupMessageHandlers();
    }

    /**
     * Core EIP-1193 method: Send request to wallet
     * Supports specifying target chain via optional _chainId parameter
     */
    public async request(args: {
        method: string;
        params?: any[];
        _chainId?: `0x${string}`; // Extended parameter: specify target chain ID
    }): Promise<any> {
        const { method, params = [] } = args;

        // Determine target chain ID (use specified chain ID if provided, otherwise use active chain)
        const targetChainId = args._chainId || this._activeChainId;

        // Check if specified chain is added
        if (args._chainId && !this._chains[args._chainId]) {
            throw new Error(`Chain ${args._chainId} not supported. Please add it first.`);
        }

        // Handle various methods
        switch (method) {
            case 'eth_requestAccounts':
                return this._handleRequestAccounts(targetChainId);

            case 'eth_accounts':
                return this._handleEthAccounts(targetChainId);

            case 'eth_chainId':
                return targetChainId;

            case 'net_version':
                return parseInt(targetChainId, 16).toString();

            case 'eth_getBalance':
                return this._mockBalance(params[0], targetChainId);

            case 'eth_sendTransaction':
                return this._handleSendTransaction(params[0], targetChainId);

            case 'eth_sign':
            case 'personal_sign':
                return this._handleSign(params, targetChainId);

            case 'wallet_switchEthereumChain':
                return this._handleSwitchChain(params[0]);

            case 'wallet_addEthereumChain':
                return this._handleAddChain(params[0]);

            case 'fusewallet_getChainList':
                return this._getChainList();

            case 'fusewallet_getActiveChain':
                return this._getActiveChain();

            case 'fusewallet_getAllAccounts':
                return this._getAllAccounts();

            case 'fusewallet_requestMultipleAccounts':
                return this._requestMultipleAccounts(params[0]);

            default:
                throw new Error(`Method ${method} not supported`);
        }
    }

    /**
     * Add event listener
     */
    public on(eventName: string, listener: (payload: any) => void): void {
        if (!this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [];
        }
        this._eventListeners[eventName].push(listener);
    }

    /**
     * Remove event listener
     */
    public removeListener(eventName: string, listener: (payload: any) => void): void {
        if (!this._eventListeners[eventName]) return;

        this._eventListeners[eventName] = this._eventListeners[eventName].filter(
            (registeredListener) => registeredListener !== listener,
        );
    }

    /**
     * Compatibility with legacy enable method
     */
    public async enable(): Promise<string[]> {
        return this.request({ method: 'eth_requestAccounts' });
    }

    /**
     * OKX Wallet specific method: Send multi-chain transactions
     */
    public async sendMultiChainTransaction(
        transactions: { chainId: string; tx: any }[],
    ): Promise<Record<string, string>> {
        const results: Record<string, string> = {};

        // Process transactions for each chain sequentially
        for (const { chainId, tx } of transactions) {
            try {
                const txHash = await this.request({
                    method: 'eth_sendTransaction',
                    params: [tx],
                    _chainId: chainId as `0x${string}`,
                });
                results[chainId] = txHash;
            } catch (error: any) {
                results[chainId] = `error: ${error.message}`;
            }
        }

        return results;
    }

    /**
     * Emit event
     */
    private _emitEvent(eventName: string, payload: any): void {
        if (!this._eventListeners[eventName]) return;

        for (const listener of this._eventListeners[eventName]) {
            try {
                listener(payload);
            } catch (error) {
                console.error(`Error in ${eventName} event listener:`, error);
            }
        }
    }

    /**
     * Set up message handlers
     */
    private _setupMessageHandlers(): void {
        window.addEventListener('message', (event) => {
            console.debug('🚀 ~ FuseClientByEvm ~ window.addEventListener ~ event:', event);
            if (event.source !== window) return;
            if (!event.data || !event.data.target) return;
            if (isInpageMessage(event.data)) {
                this._handleIncomingMessage(event.data);
            }
        });
    }

    /**
     * Handle incoming messages
     */
    private _handleIncomingMessage(message: AnyFuseWalletMessage): void {
        if (isInpageMessage(message)) {
            if (isProviderEventMessage(message.data.data)) {
                const { method, params } = message.data.data;
                this._emitEvent(method, params);
            }
        }
    }

    /**
     * Handle request accounts (supports specified chain)
     */
    private async _handleRequestAccounts(chainId: `0x${string}`): Promise<string[]> {
        const message_id = uuid();
        const chain = get_chain_by_chain_id(hexToNumber(chainId));
        if (!chain) throw new Error(`Chain ${chainId} not supported`);
        const connected = await relay_message_request_connect({
            message_id,
            window: await get_current_window(window),
            timeout: 60000,
            popup: true,
            chain,
            origin: window.location.origin,
            title: document.title,
            favicon: await find_favicon(document, window.location.origin),
        });

        if (!connected) {
            throw new Error('User rejected connection request');
        }

        const accounts = await this.request({ method: 'eth_accounts', _chainId: chainId });
        const address = accounts[0];
        const chains = this._accounts[address];
        if (!chains) {
            this._accounts[address] = [chain];
        } else {
            const index = chains.findIndex((c) => c === chainId);
            if (index === -1) {
                chains.push(chainId);
            }
        }
        this._emitEvent('connect', { chainId });
        this._emitEvent('accountsChanged', this._connectedAddresses);

        return [address];
    }

    private async _handleEthAccounts(chainId: `0x${string}`) {
        const chain = get_chain_by_chain_id(hexToNumber(chainId));
        if (!chain) throw new Error(`Chain ${chainId} not supported`);
        const result = await relay_message_get_address({
            message_id: uuid(),
            timeout: 60000,
        });
        if (!result) throw new Error('Failed to retrieve address');
        const address = match_chain(chain, {
            ic: () => {
                throw new Error('IC chain is not supported');
            },
            ethereum: () => result.ethereum?.address,
            ethereum_test_sepolia: () => result.ethereum_test_sepolia?.address,
            polygon: () => result.polygon?.address,
            polygon_test_amoy: () => result.polygon_test_amoy?.address,
            bsc: () => result.bsc?.address,
            bsc_test: () => result.bsc_test?.address,
        });
        if (!address) {
            throw new Error('Failed to retrieve address');
        }
        if (!this._connectedAddresses.includes(address)) {
            this._connectedAddresses.push(address);
        }
        return [address];
    }

    /**
     * Handle send transaction (supports specified chain)
     */
    private async _handleSendTransaction(txParams: any, chainId: string): Promise<string> {
        // Validate transaction parameters
        if (!txParams.from) {
            throw new Error('Transaction requires a from address');
        }

        // Validate user connection
        if (!this._isConnected) {
            throw new Error('Please connect your wallet first');
        }

        // Validate from address is connected account
        if (!this._accounts[chainId] || !this._accounts[chainId].includes(txParams.from.toLowerCase())) {
            throw new Error(`From address not found in connected accounts for chain ${chainId}`);
        }

        // Simulate transaction hash (includes chain ID info for distinction)
        return `0x${chainId.slice(2, 6)}${Array(60)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('')}`;
    }

    /**
     * Handle sign request (supports specified chain)
     */
    private async _handleSign(params: any[], chainId: string): Promise<string> {
        // Validate parameters
        if (params.length < 2) {
            throw new Error('eth_sign requires 2 parameters');
        }

        const address = params[0];

        // Validate address is connected on specified chain
        if (!this._accounts[chainId] || !this._accounts[chainId].includes(address.toLowerCase())) {
            throw new Error(`Address ${address} not found in connected accounts for chain ${chainId}`);
        }

        // Simulate signature (includes chain ID info for distinction)
        return `0x${chainId.slice(2, 6)}${Array(126)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join('')}`;
    }

    /**
     * Handle chain switching
     */
    private async _handleSwitchChain(params: { chainId: string }): Promise<null> {
        throw new Error('Not support yet');
    }

    /**
     * Handle adding chain
     */
    private async _handleAddChain(params: any): Promise<null> {
        throw new Error('Not support yet');
    }

    /**
     * Get list of all added chains
     */
    private _getChainList() {
        return this._chains;
    }

    /**
     * Get current active chain info
     */
    private _getActiveChain() {
        return this._chains[this._activeChainId];
    }

    /**
     * Get all accounts for all chains
     */
    private _getAllAccounts(): Record<string, string[]> {
        return this._accounts;
    }

    /**
     * Request account authorization for multiple chains
     */
    private async _requestMultipleAccounts(chainIds: string[]): Promise<
        Record<
            string,
            {
                accounts: string[];
                error?: string;
            }
        >
    > {
        const results: Record<string, { accounts: string[]; error?: string }> = {};

        for (const chainId of chainIds) {
            if (!this._chains[chainId]) {
                results[chainId] = { accounts: [], error: `Chain ${chainId} not supported` };
                continue;
            }

            try {
                const accounts = await this._handleRequestAccounts(chainId as `0x${string}`);
                results[chainId] = { accounts };
            } catch (error: any) {
                results[chainId] = { accounts: [], error: error.message };
            }
        }

        return results;
    }

    /**
     * Mock account balance (return different values based on chain ID)
     */
    private _mockBalance(chainId: string): string {
        // Generate different balance based on chain ID
        const baseValue = parseInt(chainId, 16) % 10;
        return `0x${(baseValue * 10 ** 18).toString(16)}`;
    }

    async isConnected(request?: IsEvmConnectedRequest): Promise<IsEvmConnectedResponse> {
        const message_id = uuid();

        // args
        let { timeout } = request ?? {};
        const chain_id = request?.chainId ?? '0x1';
        const chain = get_chain_by_chain_id(hexToNumber(chain_id));
        if (!chain) throw new Error(`Chain ${chain_id} not supported`);
        if (timeout === undefined) timeout = DEFAULT_TIMEOUT;

        // get current origin
        const origin = window.location.origin;

        const connected = await relay_message_is_connected(
            {
                message_id,
                window: await get_current_window(window),
                timeout,
                chain,
                origin,
            },
            timeout,
        );

        return connected;
    }
}
