"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainService = void 0;
const eosjs_rpcerror_1 = require("./eosjs-rpcerror");
const eosjs_api_1 = require("./eosjs-api");
const eosjs_jsonrpc_1 = require("./eosjs-jsonrpc");
const eosjs_jssig_1 = require("./eosjs-jssig");
const elliptic_1 = require("elliptic");
const ethers_1 = require("ethers");
// const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ecc = require('eosjs-ecc');
const ec = new elliptic_1.ec('secp256k1');
// "\x19Ethereum Signed Message\n32" in hex
const ETH_PREFIX_HEX = '19457468657265756d205369676e6564204d6573736167653a0a3332';
/**
 * Basic chain service class for wrapping Wire network interactions.
 *
 * Note: If no private key is provided, the api will be "read-only" and will require you to locally sign all transactions.
 *
 * TODO: Add ability to push unsigned transactions when users pass a private_key on construction.
 */
class ChainService {
    _rpc;
    _api;
    pkProvided = false; // Set to true if initialized with a private key.
    get rpc() {
        return this._rpc;
    }
    get api() {
        return this._api;
    }
    constructor(opts) {
        this.initialize(opts.endpoint, opts.privateKeys);
    }
    /** Initializes the service, if no private key provided the api will be read only.
     *
     *  NOTE: You can still broadcast locally signed transactions with a read only api.
     *
     *  @param private_key Optional private key for the signature provider enabling read and write via the api.
     *  @returns [Api, JsonRpc] An array containing the Api and JsonRpc instances.
     */
    initialize(endpoint, private_keys) {
        try {
            if (private_keys && private_keys.length > 0)
                this.pkProvided = true;
            const signatureProvider = new eosjs_jssig_1.JsSignatureProvider(private_keys ? private_keys : []); // NOTE: [] is essentially a read only connection.
            const rpc = (this._rpc = new eosjs_jsonrpc_1.JsonRpc(endpoint, { fetch }));
            const api = (this._api = new eosjs_api_1.Api({
                rpc,
                signatureProvider,
                textDecoder: new TextDecoder(),
                textEncoder: new TextEncoder(),
            }));
            return [api, rpc];
        }
        catch (err) {
            throw new Error('Error initializing chain service: ', err);
        }
    }
    getRows(options) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.rpc.get_table_rows({
                    json: true,
                    code: options.contract,
                    scope: options.scope != undefined
                        ? options.scope
                        : options.contract,
                    table: options.table,
                    index_position: options.index_position,
                    limit: options.limit ? options.limit : 100,
                    lower_bound: options.lower_bound,
                    upper_bound: options.upper_bound,
                    key_type: options.key_type,
                    reverse: options.reverse,
                });
                resolve(result);
            }
            catch (e) {
                reject(e);
                // if (e instanceof RpcError) {
                // }
            }
        });
    }
    /**
     * Given a locally signed transaction, this method will push the transaction to the chain. Works with both read only and write enabled APIs ( no private key needed ).
     *
     * @param trx The signed but not broadcasted transaction.
     * @param wire_sig The wire signature to push with the transaction.
     * @returns The result of the transaction push.
     */
    async pushSignedTransaction(trx, wire_sig) {
        trx.signatures.push(wire_sig);
        const result = await this.api.pushSignedTransaction(trx).catch((err) => {
            if (err instanceof eosjs_rpcerror_1.RpcError) {
                if (err.message.includes('action declares irrelevant authority') &&
                    err.message.includes(`"permission":"auth.ext"`))
                    throw new Error('Create Link incomplete, missing auth.ext linked permissions:', err);
                throw new Error(err.json.error.details[0].message);
                // throw new Error("RPC Error Pushing Transaction: " + JSON.stringify(err.json, null, 2));
            }
            else
                throw new Error(err);
        });
        return result;
    }
    /**
     * Pushes a transaction to the chain.
     *
     * NOTE: If chain service was not initialized with a private key, this method will throw an error. Use 'pushSignedTransaction' when no private key used.
     *
     * @param transaction The transaction(s) to push to the chain.
     * @param options Additional transaction options.
     * @returns Receipt of transaction.
     */
    async pushTransaction(transaction, options) {
        return new Promise(async (res, rej) => {
            if (!this.pkProvided)
                rej('Cannot push unsigned transactions with a read only API. Must initialize with a private key.');
            const actions = [];
            if (Array.isArray(transaction)) {
                for (const option of transaction) {
                    const { account, name, actor, data, permission } = option;
                    actions.push({
                        account: account,
                        name: name,
                        authorization: [
                            {
                                actor: actor,
                                permission: permission,
                            },
                        ],
                        data: data,
                    });
                }
            }
            else {
                const { account, name, actor, data, permission } = transaction;
                actions.push({
                    account: account,
                    name: name,
                    authorization: [
                        {
                            actor: actor,
                            permission: permission,
                        },
                    ],
                    data: data,
                });
            }
            try {
                const transaction = { actions };
                if (options) {
                    if (options.delay_sec)
                        transaction.delay_sec = options.delay_sec;
                }
                const result = await this.api.transact(transaction, {
                    blocksBehind: 3,
                    expireSeconds: 3600,
                });
                res(result);
            }
            catch (e) {
                rej(e
                    .toString()
                    .replace('Error: assertion failure with message: ', ''));
            }
        });
    }
    /**
     * Takes a wire 'Action' and converts it to an Ethereum msg_digest (hashed with Ethereum prefix). Used for verifying against Sig_EM_ signatures. Gives back the digest in multiple formats, depending on what you're trying to use. Creates a signed, unbroadcasted transaction.
     *
     * @param action The wire action to convert to an Ethereum msg_digest.
     * @returns The wire action converted to an Ethereum msg_digest along with other relevant formats.
     */
    async wireActionToDigest(action) {
        if (!this.api)
            throw new Error('Wire API not initialized properly.');
        try {
            const actions = Array.isArray(action) ? action : [action];
            const trx = (await this.api.transact({ actions }, {
                broadcast: false,
                sign: false,
                blocksBehind: 3,
                expireSeconds: 3600,
            }));
            const chainId = this.api.chainId;
            const digest = Buffer.from(((0, eosjs_jssig_1.digestFromSerializedData)(chainId, trx.serializedTransaction, trx.serializedContextFreeData, ec)));
            const digest_str = digest.toString('hex');
            const eth_digest = ethers_1.ethers.utils.solidityKeccak256(['bytes'], ['0x' + ETH_PREFIX_HEX + digest_str]);
            return { digest, digest_str, eth_digest, trx };
        }
        catch (e) {
            throw 'Error converting wire action to digest: ' + e;
        }
    }
    /**
     * Verifies the signature for a given message.
     *
     *  @param signature - The signature to verify.
     *  @param message - The message to use for verification.
     *  @returns A promise that resolves to a boolean indicating verification success.
     */
    verifySigEm(signature, message) {
        return new Promise((resolve, reject) => {
            this.getAccountKeys(message)
                .then((keys) => {
                for (const pub_key of keys) {
                    try {
                        const verify = ecc.verify(signature, message, pub_key);
                        if (verify === true) {
                            return resolve(true);
                        }
                    }
                    catch (err) {
                        reject(`Error in signature verification: ${err}`);
                    }
                }
                resolve(false);
            })
                .catch(err => {
                reject(`Error in fetching keys for signature verification: ${err}`);
            });
        });
    }
    /**
     * Verifies a signature against a public key and data.
     *
     *  @param signature The signature to verify.
     *  @param public_key The public key to use for verification.
     *  @param data The data to use for verification.
     *  @returns A promise that resolves to a boolean indicating verification success.
     */
    async verify(signature, public_key, data) {
        const pub = ecc.recover(signature, JSON.stringify(data), 'utf-8');
        const isValid = public_key === pub;
        return isValid;
    }
    /** Gets the public keys for a specific username and permission.
     *
     *  @param username The username to look up.
     *  @param perm The permission level to search.
     *  @returns A promise that resolves to an array of public keys.
     */
    async getAccountKeys(username, perm = 'active') {
        try {
            const account = await this.rpc
                .get_account(username)
                .catch((err) => {
                throw new Error('Error getting accounts: ', err);
            });
            const pub_keys = [];
            if (account && account.permissions)
                for (const key1 of account.permissions)
                    if (key1.perm_name === perm)
                        for (const key2 of key1.required_auth.keys)
                            pub_keys.push(key2.key);
            return pub_keys;
        }
        catch (err) {
            return [];
        }
    }
}
exports.ChainService = ChainService;
//# sourceMappingURL=wire-chain-service.js.map