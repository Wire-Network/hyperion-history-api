export interface Web3ConnectOptions {
    providers?: Web3ProviderOptions[];
    infuraId?: string;
    manualConnect?: boolean;
    cacheProvider?: boolean;
    theme?: string;
}
export type Web3ProviderOptions = 'walletconnect' | 'coinbasewallet';
