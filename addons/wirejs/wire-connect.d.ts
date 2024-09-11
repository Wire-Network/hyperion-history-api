/// <reference types="node" />
import { Web3ConnectOptions } from './wire-connect-interfaces';
import { ethers } from 'ethers';
import { EventEmitter } from 'events';
/**
 * Web3Connect class, this class is used to connect to the Web3 provider and listen to events. Used in WNS to facilitate web3 connections and interactions.
 *
 * Note: Can be initialized by itself to do basic web3 functionality.
 */
export declare class Web3Connect extends EventEmitter {
    private _config;
    private providerOptions;
    private web3Modal;
    provider: any;
    web3Provider?: ethers.providers.Web3Provider;
    accounts: string[];
    initialized: boolean;
    chainID: number;
    get address(): string;
    get config(): Web3ConnectOptions;
    get connected(): boolean;
    get cachedProvider(): string;
    constructor(options?: Web3ConnectOptions);
    /**
     * Connects to the Web3 provider, this will prompt the user to connect to their wallet.
     *
     * @returns Returns a promise that resolves to the connected account address.
     */
    connectWallet(): Promise<string | undefined>;
    /**
     * Initializes all web3 listeners, this is called after a successful connection. We emit all events so the parent class can listen to them more directly.
     */
    initListeners(): void;
    /**
     * Clean up of all connection data, this will remove all listeners and clear the cached provider.
     */
    disconnect(): void;
    /**
     * Prompts the user to add the WNS Testnet to their Web3 wallet.
     *
     * @returns Returns a promise that resolves to true if the user is connected to the WNS Testnet, false otherwise.
     */
    addTestnetPrompt(): Promise<boolean>;
    /**
     * Signs an Ethereum message with the connected wallet.
     *
     * @param message Message to sign.
     * @returns Returns the signature of the signed message.
     */
    signWeb3Message(message: string): Promise<string>;
}
