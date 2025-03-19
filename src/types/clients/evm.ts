import { v4 as uuid } from 'uuid';
import { hexToNumber } from 'viem';

import { get_chain_by_chain_id } from '~hooks/evm/viem';
import { relay_message_is_connected } from '~lib/messages/relay/relay-is-connected';
import { relay_message_request_connect } from '~lib/messages/relay/relay-request-connect';
import { isInpageMessage } from '~lib/messages/window';

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

    // Currently connected accounts (each chain can have different accounts)
    private _accounts: Record<string, string[]> = {};

    // Current active chain ID
    private _activeChainId = '0x1' as `0x${string}`; // Default Ethereum mainnet

    // List of added chains
    private _chains: Record<string, ChainEvmNetwork> = {
        '0x1': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.ethereum,
        '0xaa36a7': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.ethereum_test_sepolia,
        '0x89': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.polygon,
        '0x13881': DEFAULT_CURRENT_CHAIN_EVM_NETWORK.polygon_test_amoy,
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

    constructor() {
        // Initialize accounts for each chain
        Object.keys(this._chains).forEach((chainId) => {
            this._accounts[chainId] = [];
        });

        // Set up message handlers
        this._setupMessageHandlers();

        // Simulate installed wallet behavior
        setTimeout(() => {
            if (this._isConnected) {
                this._emitEvent('connect', { chainId: this._activeChainId });
            }
        }, 0);
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
                return this._accounts[targetChainId] || [];

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
    private _handleIncomingMessage(message: any): void {
        if (message.type === 'accountsChanged') {
            const { chainId, accounts } = message.data;
            this._accounts[chainId] = accounts;

            // If accounts change on active chain, trigger standard event
            if (chainId === this._activeChainId) {
                this._emitEvent('accountsChanged', accounts);
            }

            // Trigger custom multi-chain accounts changed event
            this._emitEvent('multiChainAccountsChanged', { chainId, accounts });
        } else if (message.type === 'chainChanged') {
            this._activeChainId = message.data;
            this._emitEvent('chainChanged', this._activeChainId);
        }
    }

    /**
     * Handle request accounts (supports specified chain)
     */
    private async _handleRequestAccounts(chainId: `0x${string}`): Promise<string[]> {
        const message_id = uuid();

        // Which origin is making request
        const origin = window.location.origin;
        const title = window.document.title;
        const favicon = await find_favicon(window.document, origin);
        const chain = get_chain_by_chain_id(hexToNumber(chainId));
        if (!chain) throw new Error(`Chain ${chainId} not supported`);
        // Send connection request via relay
        let connected = false;
        try {
            connected = await relay_message_request_connect(
                {
                    message_id,
                    window: await get_current_window(window),
                    timeout: 60000, // Default timeout
                    popup: true, // Always show popup for explicit account requests
                    chain,
                    origin,
                    title,
                    favicon,
                },
                60000, // Default timeout
            );
        } catch (error) {
            throw new Error('User rejected the request');
        }

        if (!connected) {
            throw new Error('User rejected the request');
        }

        // Update connection status
        this._isConnected = true;

        // Get accounts via separate request
        // const accounts = await relay_message_evm_request(
        //     {
        //         message_id: uuid(),
        //         window: await get_current_window(window),
        //         timeout: 60000,
        //         chainId: chainId,
        //         origin,
        //         method: 'eth_accounts',
        //         params: [],
        //     },
        //     60000,
        // );
        // Update accounts for this chain
        const accountsList = ['0x0000000000000000000000000000000000000000'];
        this._accounts[chainId] = accountsList;

        // If current active chain, trigger connection events
        if (chainId === this._activeChainId) {
            this._emitEvent('connect', { chainId });
            this._emitEvent('accountsChanged', accountsList);
        }

        return accountsList;
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
        const { chainId } = params;

        // Validate chain ID
        if (!chainId) {
            throw new Error('chainId is required');
        }

        // Check if chain is supported
        if (!this._chains[chainId]) {
            throw new Error(`Chain ${chainId} not supported. Please add it first.`);
        }

        // Update active chain ID
        this._activeChainId = chainId as `0x${string}`;

        this._emitEvent('chainChanged', chainId);

        // If new chain has accounts, trigger accounts changed event
        if (this._accounts[chainId] && this._accounts[chainId].length > 0) {
            this._emitEvent('accountsChanged', this._accounts[chainId]);
        } else {
            this._emitEvent('accountsChanged', []);
        }

        return null;
    }

    /**
     * Handle adding chain
     */
    private async _handleAddChain(params: any): Promise<null> {
        console.log('🚀 ~ FuseClientByEvm ~ _handleAddChain ~ params:', params);
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
    private _mockBalance(address: string, chainId: string): string {
        // Check if address is connected on specified chain
        if (!this._accounts[chainId] || !this._accounts[chainId].includes(address.toLowerCase())) {
            throw new Error(`Address ${address} not found in connected accounts for chain ${chainId}`);
        }

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
