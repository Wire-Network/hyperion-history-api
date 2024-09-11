"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Connect = void 0;
// import WalletConnect from "@walletconnect/web3-provider";
const wallet_sdk_1 = __importDefault(require("@coinbase/wallet-sdk"));
const web3modal_1 = __importDefault(require("web3modal"));
const ethers_1 = require("ethers");
const events_1 = require("events");
/**
 * Web3Connect class, this class is used to connect to the Web3 provider and listen to events. Used in WNS to facilitate web3 connections and interactions.
 *
 * Note: Can be initialized by itself to do basic web3 functionality.
 */
class Web3Connect extends events_1.EventEmitter {
    _config;
    providerOptions = {};
    web3Modal;
    provider;
    web3Provider;
    // web3Network?: ethers.providers.Network;
    accounts = [];
    initialized = false;
    chainID;
    get address() {
        return this.accounts ? this.accounts[0] : undefined;
    }
    get config() {
        return this._config ? this._config : undefined;
    }
    get connected() {
        return this.accounts && this.accounts.length > 0;
    }
    get cachedProvider() {
        return this.web3Modal.cachedProvider;
    }
    constructor(options) {
        // Initialize EventEmitter
        super();
        // Set the config
        this._config = options;
        this.providerOptions = {};
        // If passed in providers and infura key, add them to the provider options
        if (options && options.providers) {
            const infuraId = options.infuraId
                ? options.infuraId
                : 'WNS_INFURA_KEY';
            options.providers.forEach(provider => {
                switch (provider) {
                    // case 'walletconnect':
                    //     this.providerOptions.walletconnect = {
                    //         package: WalletConnect,
                    //         options: {
                    //             infuraId
                    //         }
                    //     }
                    //     break;
                    case 'coinbasewallet':
                        this.providerOptions.coinbasewallet = {
                            package: wallet_sdk_1.default,
                            options: {
                                appName: 'Wire Network',
                                infuraId,
                                appLogoUrl: 'https://assets-global.website-files.com/64f76ecf3d75db028e09ed64/64f76ecf3d75db028e09edae_image-1.png',
                                enableMobileWalletLink: true, // enable direct connection
                            },
                        };
                        break;
                }
            });
        }
        // Initialize Web3Modal instance
        this.web3Modal = new web3modal_1.default({
            cacheProvider: options.cacheProvider !== undefined
                ? options.cacheProvider
                : true,
            providerOptions: this.providerOptions,
            theme: options.theme ? options.theme : 'dark',
        });
        if (!options.manualConnect)
            this.connectWallet().catch(error => {
                console.log('Error connecting to provider:', error);
            });
    }
    /**
     * Connects to the Web3 provider, this will prompt the user to connect to their wallet.
     *
     * @returns Returns a promise that resolves to the connected account address.
     */
    async connectWallet() {
        // Check if there is a cached provider, initialize web3modal with it.
        if (this.web3Modal.cachedProvider)
            this.provider = await this.web3Modal
                .connectTo(this.web3Modal.cachedProvider)
                .catch(error => {
                throw new Error('Error connecting to cached provider:', error);
            });
        else
            this.provider = await this.web3Modal.connect().catch(error => {
                throw new Error('Web3modal.connect() error:', error);
            });
        // Get the provider and network details
        this.web3Provider = new ethers_1.ethers.providers.Web3Provider(this.provider);
        // this.web3Network = await this.web3Provider.getNetwork().
        this.accounts = await this.web3Provider.listAccounts().catch(error => {
            throw new Error('Error getting accounts:', error);
        });
        this.chainID = parseInt(await this.provider
            .request({ method: 'eth_chainId' })
            .catch((error) => {
            throw new Error('Error getting chainID:', error);
        }));
        // Once providers and accounts are set
        this.emit('initialized', this.accounts[0]);
        // Initialize listeners
        this.initListeners();
        // Return the connected account
        if (!this.accounts || this.accounts.length == 0)
            return undefined;
        else
            return this.accounts[0]; // Return the first account ( connected account )
    }
    /**
     * Initializes all web3 listeners, this is called after a successful connection. We emit all events so the parent class can listen to them more directly.
     */
    initListeners() {
        // We emit all listeners so the parent class can listen to them more directly.
        if (this.initialized)
            return;
        if (this.provider)
            try {
                this.provider.on('networkChanged', async (id) => {
                    this.chainID = parseInt(id);
                    // this.web3Network = await this.web3Provider.getNetwork().catch((error) => { throw new Error("Error getting network details:", error) });;
                    this.emit('networkChanged', id);
                    this.emit('chainChanged', id);
                });
                this.provider.on('accountsChanged', async (accounts) => {
                    this.emit('accountsChanged', accounts);
                    if (!accounts)
                        this.disconnect();
                    else
                        this.accounts = accounts;
                });
                // this.provider.on('disconnect', (code: number, reason: string) => {
                //     this.emit('disconnect', code, reason);
                //     this.disconnect();
                // })
                // this.provider.on('connect', (chain_id: string) => {
                //     this.emit('connect', chain_id);
                // })
                this.initialized = true;
            }
            catch (error) {
                throw new Error('Error initializing listeners:', error);
            }
        else {
            throw new Error('No provider found, call Connect first');
        }
    }
    /**
     * Clean up of all connection data, this will remove all listeners and clear the cached provider.
     */
    disconnect() {
        this.web3Modal.clearCachedProvider();
        this.provider?.removeAllListeners();
        this.provider = null;
        this.web3Provider = null;
        this.initialized = false;
        this.accounts = [];
    }
    /**
     * Prompts the user to add the WNS Testnet to their Web3 wallet.
     *
     * @returns Returns a promise that resolves to true if the user is connected to the WNS Testnet, false otherwise.
     */
    addTestnetPrompt() {
        return new Promise(async (resolve, reject) => {
            if (!this.provider)
                await this.connectWallet().catch(error => {
                    reject('Error connecting to provider:' + error);
                });
            // Network details
            const networkName = 'WNS Testnet';
            const chainId = '0x42e576f7'; // Hexadecimal representation of Wire's Ethereum testnet chain id: 1122334455
            const rpcUrl = 'https://eth-rpc.wire.foundation';
            const explorerUrl = 'https://eth-explore.wire.foundation';
            // Check if Web3 is connected to the correct network
            const currentChainId = await this.provider.request({
                method: 'eth_chainId',
            });
            if (currentChainId == chainId)
                resolve(true);
            else
                try {
                    // Try to switch to the custom testnet
                    await this.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: chainId }],
                    });
                    resolve(true);
                }
                catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (switchError.code === 4902) {
                        try {
                            // Add the custom testnet to MetaMask
                            await this.provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: chainId,
                                        chainName: networkName,
                                        rpcUrls: [rpcUrl],
                                        blockExplorerUrls: [explorerUrl],
                                        nativeCurrency: {
                                            name: 'Testnet Ethereum',
                                            symbol: 'ETH',
                                            decimals: 18,
                                        },
                                        iconUrls: [
                                            'https://ipfs.airwire.io/ipfs/QmPohtvAAHSfqNJEiW66pkVbvupcnyBTqag92dzsdG43ZB',
                                        ],
                                    },
                                ],
                            });
                            resolve(true);
                        }
                        catch (addError) {
                            reject('Failed to add the custom testnet' + addError);
                        }
                    }
                    else
                        reject('Failed to switch to the custom testnet' +
                            switchError);
                }
        });
    }
    /**
     * Signs an Ethereum message with the connected wallet.
     *
     * @param message Message to sign.
     * @returns Returns the signature of the signed message.
     */
    async signWeb3Message(message) {
        if (!this.connected || !this.address) {
            throw new Error('No Ethereum wallet connected. Connect wallet first.');
        }
        try {
            const sig = await this.provider.request({
                method: 'personal_sign',
                params: [message, this.address],
            });
            return sig;
        }
        catch (err) {
            console.error('Error signing message:', err);
            throw new Error(err.message);
        }
    }
}
exports.Web3Connect = Web3Connect;
//# sourceMappingURL=wire-connect.js.map