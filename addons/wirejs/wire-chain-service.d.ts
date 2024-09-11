import { Api } from './eosjs-api';
import { JsonRpc } from './eosjs-jsonrpc';
import { PushTransactionArgs } from './eosjs-rpc-interfaces';
import { GetRowData, GetRows, GetRowsOptions, WireActionDigest, ChainServiceOptions, TransactOptions, TransactionData } from './wire-chain-service-interfaces';
import { TransactResult } from './eosjs-api-interfaces';
import { Action } from './eosjs-serialize';
/**
 * Basic chain service class for wrapping Wire network interactions.
 *
 * Note: If no private key is provided, the api will be "read-only" and will require you to locally sign all transactions.
 *
 * TODO: Add ability to push unsigned transactions when users pass a private_key on construction.
 */
export declare class ChainService {
    private _rpc;
    private _api;
    private pkProvided;
    get rpc(): JsonRpc;
    get api(): Api;
    constructor(opts: ChainServiceOptions);
    /** Initializes the service, if no private key provided the api will be read only.
     *
     *  NOTE: You can still broadcast locally signed transactions with a read only api.
     *
     *  @param private_key Optional private key for the signature provider enabling read and write via the api.
     *  @returns [Api, JsonRpc] An array containing the Api and JsonRpc instances.
     */
    initialize(endpoint: string, private_keys?: string[]): [Api, JsonRpc];
    /**
     * Fetches rows based on the provided options.
     *
     *  @param options The options for fetching rows.
     *  @returns A Promise that resolves to the fetched rows.
     */
    getRows(options: GetRowsOptions): Promise<GetRowData>;
    getRows<T>(options: GetRowsOptions): Promise<GetRows<T>>;
    /**
     * Given a locally signed transaction, this method will push the transaction to the chain. Works with both read only and write enabled APIs ( no private key needed ).
     *
     * @param trx The signed but not broadcasted transaction.
     * @param wire_sig The wire signature to push with the transaction.
     * @returns The result of the transaction push.
     */
    pushSignedTransaction(trx: PushTransactionArgs, wire_sig: string): Promise<TransactResult>;
    /**
     * Pushes a transaction to the chain.
     *
     * NOTE: If chain service was not initialized with a private key, this method will throw an error. Use 'pushSignedTransaction' when no private key used.
     *
     * @param transaction The transaction(s) to push to the chain.
     * @param options Additional transaction options.
     * @returns Receipt of transaction.
     */
    pushTransaction(transaction: TransactionData | TransactionData[], options?: TransactOptions): Promise<TransactResult>;
    /**
     * Takes a wire 'Action' and converts it to an Ethereum msg_digest (hashed with Ethereum prefix). Used for verifying against Sig_EM_ signatures. Gives back the digest in multiple formats, depending on what you're trying to use. Creates a signed, unbroadcasted transaction.
     *
     * @param action The wire action to convert to an Ethereum msg_digest.
     * @returns The wire action converted to an Ethereum msg_digest along with other relevant formats.
     */
    wireActionToDigest(action: Action | Action[]): Promise<WireActionDigest>;
    /**
     * Verifies the signature for a given message.
     *
     *  @param signature - The signature to verify.
     *  @param message - The message to use for verification.
     *  @returns A promise that resolves to a boolean indicating verification success.
     */
    verifySigEm(signature: any, message: any): Promise<boolean>;
    /**
     * Verifies a signature against a public key and data.
     *
     *  @param signature The signature to verify.
     *  @param public_key The public key to use for verification.
     *  @param data The data to use for verification.
     *  @returns A promise that resolves to a boolean indicating verification success.
     */
    verify(signature: string, public_key: string, data: any): Promise<boolean>;
    /** Gets the public keys for a specific username and permission.
     *
     *  @param username The username to look up.
     *  @param perm The permission level to search.
     *  @returns A promise that resolves to an array of public keys.
     */
    getAccountKeys(username: string, perm?: string): Promise<string[]>;
}
