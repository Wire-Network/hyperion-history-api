"use strict";
/**
 * @module API
 */
// copyright defined in eosjs/LICENSE.txt
/* eslint-disable max-classes-per-file */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionBuilder = exports.TransactionBuilder = exports.Api = void 0;
const pako_1 = require("pako");
const ser = __importStar(require("./eosjs-serialize"));
class Api {
    /** Issues RPC calls */
    rpc;
    /** Get subset of `availableKeys` needed to meet authorities in a `transaction` */
    authorityProvider;
    /** Supplies ABIs in raw form (binary) */
    abiProvider;
    /** Signs transactions */
    signatureProvider;
    /** Identifies chain */
    chainId;
    textEncoder;
    textDecoder;
    /** Converts abi files between binary and structured form (`abi.abi.json`) */
    abiTypes;
    /** Converts transactions between binary and structured form (`transaction.abi.json`) */
    transactionTypes;
    /** Holds information needed to serialize contract actions */
    contracts = new Map();
    /** Fetched abis */
    cachedAbis = new Map();
    /**
     * @param args
     * * `rpc`: Issues RPC calls
     * * `authorityProvider`: Get public keys needed to meet authorities in a transaction
     * * `abiProvider`: Supplies ABIs in raw form (binary)
     * * `signatureProvider`: Signs transactions
     * * `chainId`: Identifies chain
     * * `textEncoder`: `TextEncoder` instance to use. Pass in `null` if running in a browser
     * * `textDecoder`: `TextDecoder` instance to use. Pass in `null` if running in a browser
     */
    constructor(args) {
        this.rpc = args.rpc;
        this.authorityProvider = args.authorityProvider || args.rpc;
        this.abiProvider = args.abiProvider || args.rpc;
        this.signatureProvider = args.signatureProvider;
        this.chainId = args.chainId;
        this.textEncoder = args.textEncoder;
        this.textDecoder = args.textDecoder;
        this.abiTypes = ser.getTypesFromAbi(ser.createAbiTypes());
        this.transactionTypes = ser.getTypesFromAbi(ser.createTransactionTypes());
    }
    /** Decodes an abi as Uint8Array into json. */
    rawAbiToJson(rawAbi) {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: rawAbi,
        });
        if (!ser.supportedAbiVersion(buffer.getString())) {
            throw new Error('Unsupported abi version');
        }
        buffer.restartRead();
        return this.abiTypes.get('abi_def').deserialize(buffer);
    }
    /** Encodes a json abi as Uint8Array. */
    jsonToRawAbi(jsonAbi) {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        });
        this.abiTypes.get('abi_def').serialize(buffer, jsonAbi);
        if (!ser.supportedAbiVersion(buffer.getString())) {
            throw new Error('Unsupported abi version');
        }
        return buffer.asUint8Array();
    }
    /** Get abi in both binary and structured forms. Fetch when needed. */
    async getCachedAbi(accountName, reload = false) {
        if (!reload && this.cachedAbis.get(accountName)) {
            return this.cachedAbis.get(accountName);
        }
        let cachedAbi;
        try {
            const rawAbi = (await this.abiProvider.getRawAbi(accountName)).abi;
            const abi = this.rawAbiToJson(rawAbi);
            cachedAbi = { rawAbi, abi };
        }
        catch (e) {
            e.message = `fetching abi for ${accountName}: ${e.message}`;
            throw e;
        }
        if (!cachedAbi) {
            throw new Error(`Missing abi for ${accountName}`);
        }
        this.cachedAbis.set(accountName, cachedAbi);
        return cachedAbi;
    }
    /** Get abi in structured form. Fetch when needed. */
    async getAbi(accountName, reload = false) {
        return (await this.getCachedAbi(accountName, reload)).abi;
    }
    /** Get abis needed by a transaction */
    async getTransactionAbis(transaction, reload = false) {
        const actions = (transaction.context_free_actions || []).concat(transaction.actions);
        const accounts = actions.map((action) => action.account);
        const uniqueAccounts = new Set(accounts);
        const actionPromises = [...uniqueAccounts].map(async (account) => ({
            accountName: account,
            abi: (await this.getCachedAbi(account, reload)).rawAbi,
        }));
        return Promise.all(actionPromises);
    }
    /** Get data needed to serialize actions in a contract */
    async getContract(accountName, reload = false) {
        if (!reload && this.contracts.get(accountName)) {
            return this.contracts.get(accountName);
        }
        const abi = await this.getAbi(accountName, reload);
        const types = ser.getTypesFromAbi(ser.createInitialTypes(), abi);
        const actions = new Map();
        for (const { name, type } of abi.actions) {
            actions.set(name, ser.getType(types, type));
        }
        const result = { types, actions };
        this.contracts.set(accountName, result);
        return result;
    }
    /** Convert `value` to binary form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    serialize(buffer, type, value) {
        this.transactionTypes.get(type).serialize(buffer, value);
    }
    /** Convert data in `buffer` to structured form. `type` must be a built-in abi type or in `transaction.abi.json`. */
    deserialize(buffer, type) {
        return this.transactionTypes.get(type).deserialize(buffer);
    }
    /** Convert a transaction to binary */
    serializeTransaction(transaction) {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        });
        this.serialize(buffer, 'transaction', {
            max_net_usage_words: 0,
            max_cpu_usage_ms: 0,
            delay_sec: 0,
            context_free_actions: [],
            actions: [],
            transaction_extensions: [],
            ...transaction,
        });
        return buffer.asUint8Array();
    }
    /** Serialize context-free data */
    serializeContextFreeData(contextFreeData) {
        if (!contextFreeData || !contextFreeData.length) {
            return null;
        }
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        });
        buffer.pushVaruint32(contextFreeData.length);
        for (const data of contextFreeData) {
            buffer.pushBytes(data);
        }
        return buffer.asUint8Array();
    }
    /** Convert a transaction from binary. Leaves actions in hex. */
    deserializeTransaction(transaction) {
        const buffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        });
        buffer.pushArray(transaction);
        return this.deserialize(buffer, 'transaction');
    }
    transactionExtensions = [
        {
            id: 1,
            type: 'resource_payer',
            keys: ['payer', 'max_net_bytes', 'max_cpu_us', 'max_memory_bytes'],
        },
    ];
    // Order of adding to transaction_extension is transaction_extension id ascending
    serializeTransactionExtensions(transaction) {
        let transaction_extensions = [];
        if (transaction.resource_payer) {
            const extensionBuffer = new ser.SerialBuffer({
                textEncoder: this.textEncoder,
                textDecoder: this.textDecoder,
            });
            const types = ser.getTypesFromAbi(ser.createTransactionExtensionTypes());
            types
                .get('resource_payer')
                .serialize(extensionBuffer, transaction.resource_payer);
            transaction_extensions = [
                ...transaction_extensions,
                [1, ser.arrayToHex(extensionBuffer.asUint8Array())],
            ];
        }
        return transaction_extensions;
    }
    // Usage: transaction = {...transaction, ...this.deserializeTransactionExtensions(transaction.transaction_extensions)}
    deserializeTransactionExtensions(data) {
        const transaction = {};
        data.forEach((extensionData) => {
            const transactionExtension = this.transactionExtensions.find(extension => extension.id === extensionData[0]);
            if (transactionExtension === undefined) {
                throw new Error(`Transaction Extension could not be determined: ${extensionData}`);
            }
            const types = ser.getTypesFromAbi(ser.createTransactionExtensionTypes());
            const extensionBuffer = new ser.SerialBuffer({
                textEncoder: this.textEncoder,
                textDecoder: this.textDecoder,
            });
            extensionBuffer.pushArray(ser.hexToUint8Array(extensionData[1]));
            const deserializedObj = types
                .get(transactionExtension.type)
                .deserialize(extensionBuffer);
            if (extensionData[0] === 1) {
                deserializedObj.max_net_bytes = Number(deserializedObj.max_net_bytes);
                deserializedObj.max_cpu_us = Number(deserializedObj.max_cpu_us);
                deserializedObj.max_memory_bytes = Number(deserializedObj.max_memory_bytes);
                transaction.resource_payer = deserializedObj;
            }
        });
        return transaction;
    }
    // Transaction extensions are serialized and moved to `transaction_extensions`, deserialized objects are not needed on the transaction
    deleteTransactionExtensionObjects(transaction) {
        delete transaction.resource_payer;
        return transaction;
    }
    /** Convert actions to hex */
    async serializeActions(actions) {
        return await Promise.all(actions.map(async (action) => {
            const { account, name, authorization, data } = action;
            const contract = await this.getContract(account);
            if (typeof data !== 'object') {
                return action;
            }
            return ser.serializeAction(contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
        }));
    }
    /** Convert actions from hex */
    async deserializeActions(actions) {
        return await Promise.all(actions.map(async ({ account, name, authorization, data }) => {
            const contract = await this.getContract(account);
            return ser.deserializeAction(contract, account, name, authorization, data, this.textEncoder, this.textDecoder);
        }));
    }
    /** Convert a transaction from binary. Also deserializes actions. */
    async deserializeTransactionWithActions(transaction) {
        if (typeof transaction === 'string') {
            transaction = ser.hexToUint8Array(transaction);
        }
        const deserializedTransaction = this.deserializeTransaction(transaction);
        const deserializedCFActions = await this.deserializeActions(deserializedTransaction.context_free_actions);
        const deserializedActions = await this.deserializeActions(deserializedTransaction.actions);
        return {
            ...deserializedTransaction,
            context_free_actions: deserializedCFActions,
            actions: deserializedActions,
        };
    }
    /** Deflate a serialized object */
    deflateSerializedArray(serializedArray) {
        return (0, pako_1.deflate)(serializedArray, { level: 9 });
    }
    /** Inflate a compressed serialized object */
    inflateSerializedArray(compressedSerializedArray) {
        return (0, pako_1.inflate)(compressedSerializedArray);
    }
    /**
     * Create and optionally broadcast a transaction.
     *
     * Named Parameters:
     * `broadcast`: broadcast this transaction?
     * `sign`: sign this transaction?
     * `compression`: compress this transaction?
     * `readOnlyTrx`: read only transaction?
     * `returnFailureTraces`: return failure traces? (only available for read only transactions currently)
     *
     * If both `blocksBehind` and `expireSeconds` are present,
     * then fetch the block which is `blocksBehind` behind head block,
     * use it as a reference for TAPoS, and expire the transaction `expireSeconds` after that block's time.
     *
     * If both `useLastIrreversible` and `expireSeconds` are present,
     * then fetch the last irreversible block, use it as a reference for TAPoS,
     * and expire the transaction `expireSeconds` after that block's time.
     *
     * @returns node response if `broadcast`, `{signatures, serializedTransaction}` if `!broadcast`
     */
    async transact(transaction, { broadcast = true, sign = true, readOnlyTrx, returnFailureTraces, requiredKeys, compression, blocksBehind, useLastIrreversible, expireSeconds, } = {}) {
        let info;
        if (typeof blocksBehind === 'number' && useLastIrreversible) {
            throw new Error('Use either blocksBehind or useLastIrreversible');
        }
        if (!this.chainId) {
            info = await this.rpc.get_info();
            this.chainId = info.chain_id;
        }
        if ((typeof blocksBehind === 'number' || useLastIrreversible) &&
            expireSeconds) {
            transaction = await this.generateTapos(info, transaction, blocksBehind, useLastIrreversible, expireSeconds);
        }
        if (!this.hasRequiredTaposFields(transaction)) {
            throw new Error('Required configuration or TAPOS fields are not present');
        }
        const abis = await this.getTransactionAbis(transaction);
        transaction = {
            ...transaction,
            transaction_extensions: await this.serializeTransactionExtensions(transaction),
            context_free_actions: await this.serializeActions(transaction.context_free_actions || []),
            actions: await this.serializeActions(transaction.actions),
        };
        transaction = this.deleteTransactionExtensionObjects(transaction);
        const serializedTransaction = this.serializeTransaction(transaction);
        const serializedContextFreeData = this.serializeContextFreeData(transaction.context_free_data);
        let pushTransactionArgs = {
            serializedTransaction,
            serializedContextFreeData,
            signatures: [],
        };
        if (sign) {
            if (!requiredKeys) {
                const availableKeys = await this.signatureProvider.getAvailableKeys();
                requiredKeys = await this.authorityProvider.getRequiredKeys({
                    transaction,
                    availableKeys,
                });
            }
            pushTransactionArgs = await this.signatureProvider.sign({
                chainId: this.chainId,
                requiredKeys,
                serializedTransaction,
                serializedContextFreeData,
                abis,
            });
        }
        if (broadcast) {
            if (compression) {
                return this.pushCompressedSignedTransaction(pushTransactionArgs, readOnlyTrx, returnFailureTraces);
            }
            return this.pushSignedTransaction(pushTransactionArgs, readOnlyTrx, returnFailureTraces);
        }
        return pushTransactionArgs;
    }
    async query(account, short, query, { sign, requiredKeys, authorization = [] }) {
        const info = await this.rpc.get_info();
        const refBlock = await this.tryRefBlockFromGetInfo(info);
        const queryBuffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
        });
        ser.serializeQuery(queryBuffer, query);
        const transaction = {
            ...ser.transactionHeader(refBlock, 60 * 30),
            context_free_actions: [],
            actions: [
                {
                    account,
                    name: 'queryit',
                    authorization,
                    data: ser.arrayToHex(queryBuffer.asUint8Array()),
                },
            ],
        };
        const serializedTransaction = this.serializeTransaction(transaction);
        let signatures = [];
        if (sign) {
            const abis = await this.getTransactionAbis(transaction);
            if (!requiredKeys) {
                const availableKeys = await this.signatureProvider.getAvailableKeys();
                requiredKeys = await this.authorityProvider.getRequiredKeys({
                    transaction,
                    availableKeys,
                });
            }
            const signResponse = await this.signatureProvider.sign({
                chainId: this.chainId,
                requiredKeys,
                serializedTransaction,
                serializedContextFreeData: null,
                abis,
            });
            signatures = signResponse.signatures;
        }
        const response = (await this.rpc.send_transaction({
            signatures,
            compression: 0,
            serializedTransaction,
        }));
        const returnBuffer = new ser.SerialBuffer({
            textEncoder: this.textEncoder,
            textDecoder: this.textDecoder,
            array: ser.hexToUint8Array(response.processed.action_traces[0][1].return_value),
        });
        if (short) {
            return ser.deserializeAnyvarShort(returnBuffer);
        }
        else {
            return ser.deserializeAnyvar(returnBuffer);
        }
    }
    /** Broadcast a signed transaction */
    async pushSignedTransaction({ signatures, serializedTransaction, serializedContextFreeData, }, readOnlyTrx = false, returnFailureTraces = false) {
        if (readOnlyTrx) {
            return this.rpc.push_ro_transaction({
                signatures,
                serializedTransaction,
                serializedContextFreeData,
            }, returnFailureTraces);
        }
        return this.rpc.push_transaction({
            signatures,
            serializedTransaction,
            serializedContextFreeData,
        });
    }
    async pushCompressedSignedTransaction({ signatures, serializedTransaction, serializedContextFreeData, }, readOnlyTrx = false, returnFailureTraces = false) {
        const compressedSerializedTransaction = this.deflateSerializedArray(serializedTransaction);
        const compressedSerializedContextFreeData = this.deflateSerializedArray(serializedContextFreeData || new Uint8Array(0));
        if (readOnlyTrx) {
            return this.rpc.push_ro_transaction({
                signatures,
                compression: 1,
                serializedTransaction: compressedSerializedTransaction,
                serializedContextFreeData: compressedSerializedContextFreeData,
            }, returnFailureTraces);
        }
        return this.rpc.push_transaction({
            signatures,
            compression: 1,
            serializedTransaction: compressedSerializedTransaction,
            serializedContextFreeData: compressedSerializedContextFreeData,
        });
    }
    async generateTapos(info, transaction, blocksBehind, useLastIrreversible, expireSeconds) {
        if (!info) {
            info = await this.rpc.get_info();
        }
        if (useLastIrreversible) {
            const block = await this.tryRefBlockFromGetInfo(info);
            return {
                ...ser.transactionHeader(block, expireSeconds),
                ...transaction,
            };
        }
        const taposBlockNumber = info.head_block_num - blocksBehind;
        const refBlock = taposBlockNumber <= info.last_irreversible_block_num
            ? await this.tryGetBlockInfo(taposBlockNumber)
            : await this.tryGetBlockHeaderState(taposBlockNumber);
        return {
            ...ser.transactionHeader(refBlock, expireSeconds),
            ...transaction,
        };
    }
    // eventually break out into TransactionValidator class
    hasRequiredTaposFields({ expiration, ref_block_num, ref_block_prefix, }) {
        return !!(expiration &&
            typeof ref_block_num === 'number' &&
            typeof ref_block_prefix === 'number');
    }
    async tryGetBlockHeaderState(taposBlockNumber) {
        try {
            return await this.rpc.get_block_header_state(taposBlockNumber);
        }
        catch (error) {
            return await this.tryGetBlockInfo(taposBlockNumber);
        }
    }
    async tryGetBlockInfo(blockNumber) {
        try {
            return await this.rpc.get_block_info(blockNumber);
        }
        catch (error) {
            return await this.rpc.get_block(blockNumber);
        }
    }
    async tryRefBlockFromGetInfo(info) {
        if (info.hasOwnProperty('last_irreversible_block_id') &&
            info.hasOwnProperty('last_irreversible_block_num') &&
            info.hasOwnProperty('last_irreversible_block_time')) {
            return {
                block_num: info.last_irreversible_block_num,
                id: info.last_irreversible_block_id,
                timestamp: info.last_irreversible_block_time,
            };
        }
        else {
            const block = await this.tryGetBlockInfo(info.last_irreversible_block_num);
            return {
                block_num: block.block_num,
                id: block.id,
                timestamp: block.timestamp,
            };
        }
    }
    with(accountName) {
        return new ActionBuilder(this, accountName);
    }
    buildTransaction(cb) {
        const tx = new TransactionBuilder(this);
        if (cb) {
            return cb(tx);
        }
        return tx;
    }
} // Api
exports.Api = Api;
class TransactionBuilder {
    api;
    actions = [];
    contextFreeGroups = [];
    constructor(api) {
        this.api = api;
    }
    with(accountName) {
        const actionBuilder = new ActionBuilder(this.api, accountName);
        this.actions.push(actionBuilder);
        return actionBuilder;
    }
    associateContextFree(contextFreeGroup) {
        this.contextFreeGroups.push(contextFreeGroup);
        return this;
    }
    async send(config) {
        const contextFreeDataSet = [];
        const contextFreeActions = [];
        const actions = this.actions.map(actionBuilder => actionBuilder.serializedData);
        await Promise.all(this.contextFreeGroups.map(async (contextFreeCallback) => {
            const { action, contextFreeAction, contextFreeData } = contextFreeCallback({
                cfd: contextFreeDataSet.length,
                cfa: contextFreeActions.length,
            });
            if (action) {
                actions.push(action);
            }
            if (contextFreeAction) {
                contextFreeActions.push(contextFreeAction);
            }
            if (contextFreeData) {
                contextFreeDataSet.push(contextFreeData);
            }
        }));
        this.contextFreeGroups = [];
        this.actions = [];
        return await this.api.transact({
            context_free_data: contextFreeDataSet,
            context_free_actions: contextFreeActions,
            actions,
        }, config);
    }
}
exports.TransactionBuilder = TransactionBuilder;
class ActionBuilder {
    api;
    accountName;
    serializedData;
    constructor(api, accountName) {
        this.api = api;
        this.accountName = accountName;
    }
    as(actorName = []) {
        let authorization = [];
        if (actorName && typeof actorName === 'string') {
            authorization = [{ actor: actorName, permission: 'active' }];
        }
        else {
            authorization = actorName;
        }
        return new ActionSerializer(this, this.api, this.accountName, authorization);
    }
}
exports.ActionBuilder = ActionBuilder;
class ActionSerializer {
    constructor(parent, api, accountName, authorization) {
        const jsonAbi = api.cachedAbis.get(accountName);
        if (!jsonAbi) {
            throw new Error('ABI must be cached before using ActionBuilder, run api.getAbi()');
        }
        const types = ser.getTypesFromAbi(ser.createInitialTypes(), jsonAbi.abi);
        const actions = new Map();
        for (const { name, type } of jsonAbi.abi.actions) {
            actions.set(name, ser.getType(types, type));
        }
        actions.forEach((type, name) => {
            Object.assign(this, {
                [name]: (...args) => {
                    const data = {};
                    args.forEach((arg, index) => {
                        const field = type.fields[index];
                        data[field.name] = arg;
                    });
                    const serializedData = ser.serializeAction({ types, actions }, accountName, name, authorization, data, api.textEncoder, api.textDecoder);
                    parent.serializedData = serializedData;
                    return serializedData;
                },
            });
        });
    }
}
//# sourceMappingURL=eosjs-api.js.map