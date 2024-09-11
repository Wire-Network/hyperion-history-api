"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpc = void 0;
const eosjs_numeric_1 = require("./eosjs-numeric");
const eosjs_rpcerror_1 = require("./eosjs-rpcerror");
const arrayToHex = (data) => {
    let result = '';
    for (const x of data) {
        result += ('00' + x.toString(16)).slice(-2);
    }
    return result;
};
/** Make RPC calls */
class JsonRpc {
    endpoint;
    fetchBuiltin;
    /**
     * @param args
     * `fetch`:
     * browsers: leave `null` or `undefined`
     * node: provide an implementation
     */
    constructor(endpoint, args = {}) {
        this.endpoint = endpoint.replace(/\/$/, '');
        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        }
        else {
            this.fetchBuiltin = global.fetch;
        }
    }
    /** Post `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    async fetch(path, body) {
        let response;
        let json;
        try {
            const f = this.fetchBuiltin;
            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                method: 'POST',
            });
            json = await response.json();
            if (json.processed && json.processed.except) {
                throw new eosjs_rpcerror_1.RpcError(json);
            }
            else if (json.result && json.result.except) {
                throw new eosjs_rpcerror_1.RpcError(json);
            }
        }
        catch (e) {
            e.isFetchError = true;
            throw e;
        }
        if (!response.ok) {
            throw new eosjs_rpcerror_1.RpcError(json);
        }
        return json;
    }
    async abi_bin_to_json(code, action, binargs) {
        return await this.fetch('/v1/chain/abi_bin_to_json', {
            code,
            action,
            binargs,
        });
    }
    async abi_json_to_bin(code, action, args) {
        return await this.fetch('/v1/chain/abi_json_to_bin', {
            code,
            action,
            args,
        });
    }
    /** Raw call to `/v1/chain/get_abi` */
    async get_abi(accountName) {
        return await this.fetch('/v1/chain/get_abi', {
            account_name: accountName,
        });
    }
    /** Raw call to `/v1/chain/get_account` */
    async get_account(accountName) {
        return await this.fetch('/v1/chain/get_account', {
            account_name: accountName,
        });
    }
    /** Raw call to `/v1/chain/get_accounts_by_authorizers` */
    async get_accounts_by_authorizers(accounts, keys) {
        return await this.fetch('/v1/chain/get_accounts_by_authorizers', {
            accounts,
            keys,
        });
    }
    /** Raw call to `get_activated_protocol_features` */
    async get_activated_protocol_features({ limit = 10, search_by_block_num = false, reverse = false, lower_bound = null, upper_bound = null, }) {
        return await this.fetch('/v1/chain/get_activated_protocol_features', {
            lower_bound,
            upper_bound,
            limit,
            search_by_block_num,
            reverse,
        });
    }
    /** Raw call to `/v1/chain/get_block_header_state` */
    async get_block_header_state(blockNumOrId) {
        return await this.fetch('/v1/chain/get_block_header_state', {
            block_num_or_id: blockNumOrId,
        });
    }
    /** Raw call to `/v1/chain/get_block_info` */
    async get_block_info(blockNum) {
        return await this.fetch('/v1/chain/get_block_info', {
            block_num: blockNum,
        });
    }
    /** Raw call to `/v1/chain/get_block` */
    async get_block(blockNumOrId) {
        return await this.fetch('/v1/chain/get_block', {
            block_num_or_id: blockNumOrId,
        });
    }
    /** Raw call to `/v1/chain/get_code` */
    async get_code(accountName) {
        return await this.fetch('/v1/chain/get_code', {
            account_name: accountName,
            code_as_wasm: true,
        });
    }
    /** Raw call to `/v1/chain/get_code_hash` */
    async get_code_hash(accountName) {
        return await this.fetch('/v1/chain/get_code_hash', {
            account_name: accountName,
        });
    }
    /** Raw call to `/v1/chain/get_currency_balance` */
    async get_currency_balance(code, account, symbol = null) {
        return await this.fetch('/v1/chain/get_currency_balance', {
            code,
            account,
            symbol,
        });
    }
    /** Raw call to `/v1/chain/get_currency_stats` */
    async get_currency_stats(code, symbol) {
        return await this.fetch('/v1/chain/get_currency_stats', {
            code,
            symbol,
        });
    }
    /** Raw call to `/v1/chain/get_info` */
    async get_info() {
        return await this.fetch('/v1/chain/get_info', {});
    }
    /** Raw call to `/v1/chain/get_producer_schedule` */
    async get_producer_schedule() {
        return await this.fetch('/v1/chain/get_producer_schedule', {});
    }
    /** Raw call to `/v1/chain/get_producers` */
    async get_producers(json = true, lowerBound = '', limit = 50) {
        return await this.fetch('/v1/chain/get_producers', {
            json,
            lower_bound: lowerBound,
            limit,
        });
    }
    /** Raw call to `/v1/chain/get_raw_code_and_abi` */
    async get_raw_code_and_abi(accountName) {
        return await this.fetch('/v1/chain/get_raw_code_and_abi', {
            account_name: accountName,
        });
    }
    /** calls `/v1/chain/get_raw_code_and_abi` and pulls out unneeded raw wasm code */
    async getRawAbi(accountName) {
        const rawAbi = await this.get_raw_abi(accountName);
        const abi = (0, eosjs_numeric_1.base64ToBinary)(rawAbi.abi);
        return { accountName: rawAbi.account_name, abi };
    }
    /** Raw call to `/v1/chain/get_raw_abi` */
    async get_raw_abi(accountName) {
        return await this.fetch('/v1/chain/get_raw_abi', {
            account_name: accountName,
        });
    }
    /** Raw call to `/v1/chain/get_scheduled_transactions` */
    async get_scheduled_transactions(json = true, lowerBound = '', limit = 50) {
        return await this.fetch('/v1/chain/get_scheduled_transactions', {
            json,
            lower_bound: lowerBound,
            limit,
        });
    }
    /** Raw call to `/v1/chain/get_table_rows` */
    async get_table_rows({ json = true, code, scope, table, lower_bound = '', upper_bound = '', index_position = 1, key_type = '', limit = 10, reverse = false, show_payer = false, }) {
        return await this.fetch('/v1/chain/get_table_rows', {
            json,
            code,
            scope,
            table,
            lower_bound,
            upper_bound,
            index_position,
            key_type,
            limit,
            reverse,
            show_payer,
        });
    }
    /** Raw call to `/v1/chain/get_kv_table_rows` */
    async get_kv_table_rows({ json = true, code, table, index_name, encode_type = 'bytes', index_value, lower_bound, upper_bound, limit = 10, reverse = false, show_payer = false, }) {
        return await this.fetch('/v1/chain/get_kv_table_rows', {
            json,
            code,
            table,
            index_name,
            encode_type,
            index_value,
            lower_bound,
            upper_bound,
            limit,
            reverse,
            show_payer,
        });
    }
    /** Raw call to `/v1/chain/get_table_by_scope` */
    async get_table_by_scope({ code, table, lower_bound = '', upper_bound = '', limit = 10, }) {
        return await this.fetch('/v1/chain/get_table_by_scope', {
            code,
            table,
            lower_bound,
            upper_bound,
            limit,
        });
    }
    /** Get subset of `availableKeys` needed to meet authorities in `transaction`. Implements `AuthorityProvider` */
    async getRequiredKeys(args) {
        return (0, eosjs_numeric_1.convertLegacyPublicKeys)((await this.fetch('/v1/chain/get_required_keys', {
            transaction: args.transaction,
            available_keys: args.availableKeys,
        })).required_keys);
    }
    /** Push a serialized transaction (replaced by send_transaction, but returned format has changed) */
    async push_transaction({ signatures, compression = 0, serializedTransaction, serializedContextFreeData, }) {
        return await this.fetch('/v1/chain/push_transaction', {
            signatures,
            compression,
            packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
            packed_trx: arrayToHex(serializedTransaction),
        });
    }
    /** Raw call to `/v1/chain/push_ro_transaction */
    async push_ro_transaction({ signatures, compression = 0, serializedTransaction, }, returnFailureTraces = false) {
        return await this.fetch('/v1/chain/push_ro_transaction', {
            transaction: {
                signatures,
                compression,
                packed_context_free_data: arrayToHex(new Uint8Array(0)),
                packed_trx: arrayToHex(serializedTransaction),
            },
            return_failure_traces: returnFailureTraces,
        });
    }
    async push_transactions(transactions) {
        const packedTrxs = transactions.map(({ signatures, compression = 0, serializedTransaction, serializedContextFreeData, }) => {
            return {
                signatures,
                compression,
                packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
                packed_trx: arrayToHex(serializedTransaction),
            };
        });
        return await this.fetch('/v1/chain/push_transactions', packedTrxs);
    }
    /** Send a serialized transaction */
    async send_transaction({ signatures, compression = 0, serializedTransaction, serializedContextFreeData, }) {
        return await this.fetch('/v1/chain/send_transaction', {
            signatures,
            compression,
            packed_context_free_data: arrayToHex(serializedContextFreeData || new Uint8Array(0)),
            packed_trx: arrayToHex(serializedTransaction),
        });
    }
    /** Raw call to `/v1/db_size/get` */
    async db_size_get() {
        return await this.fetch('/v1/db_size/get', {});
    }
    /** Raw call to `/v1/trace_api/get_block` */
    async trace_get_block(block_num) {
        return await this.fetch('/v1/trace_api/get_block', { block_num });
    }
    /** Raw call to `/v1/history/get_actions` */
    async history_get_actions(accountName, pos = null, offset = null) {
        return await this.fetch('/v1/history/get_actions', {
            account_name: accountName,
            pos,
            offset,
        });
    }
    /** Raw call to `/v1/history/get_transaction` */
    async history_get_transaction(id, blockNumHint = null) {
        return await this.fetch('/v1/history/get_transaction', {
            id,
            block_num_hint: blockNumHint,
        });
    }
    /** Raw call to `/v1/history/get_key_accounts` */
    async history_get_key_accounts(publicKey) {
        return await this.fetch('/v1/history/get_key_accounts', {
            public_key: publicKey,
        });
    }
    /** Raw call to `/v1/history/get_controlled_accounts` */
    async history_get_controlled_accounts(controllingAccount) {
        return await this.fetch('/v1/history/get_controlled_accounts', {
            controlling_account: controllingAccount,
        });
    }
} // JsonRpc
exports.JsonRpc = JsonRpc;
//# sourceMappingURL=eosjs-jsonrpc.js.map