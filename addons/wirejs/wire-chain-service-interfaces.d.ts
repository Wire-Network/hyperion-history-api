/// <reference types="node" />
import { PushTransactionArgs } from './eosjs-rpc-interfaces';
export interface PingResponse {
    ms?: number;
    endpoint: string;
}
export interface ChainAuth {
    username: string;
    signature: string;
}
export interface GetRows<T> {
    rows: Array<T>;
    more: boolean;
    next_key: string;
}
export interface GetRowData {
    rows: Array<any>;
    more: boolean;
    next_key: string;
}
export interface getKeys {
    data: Keys;
    msg: string;
    result: number;
}
export interface WireKeys {
    [key: string]: Keys;
}
export interface Keys {
    active: Key;
    owner: Key;
}
export interface Key {
    pub_key: string;
    priv_key: string;
}
export interface Auth {
    actor: string;
    permission: string;
}
export interface TransactOptions {
    delay_sec?: number;
}
export interface GetRowsOptions {
    contract: string;
    scope?: string | number;
    table: string;
    index_position?: string | number;
    limit?: number;
    lower_bound?: string | number;
    upper_bound?: string | number;
    key_type?: string;
    reverse?: boolean;
}
export interface GetRows<T> {
    rows: Array<T>;
    more: boolean;
    next_key: string;
}
export interface GetRowData {
    rows: Array<any>;
    more: boolean;
    next_key: string;
}
export interface TransactionOptions {
    account?: string;
    name: string;
    actor?: string;
    authorization?: TransactionAuth[];
    data: any;
    permission?: string;
}
export interface TransactionData {
    account: string;
    name: string;
    actor: string;
    permission: 'owner' | 'active' | string;
    data: any;
}
export interface PushTransactionOptions {
    account: string;
    name: string;
    authorization: TransactionAuth[];
    data: Record<string, any>;
}
export interface TransactionAuth {
    actor: string;
    permission: string;
}
export interface WireKey {
    owner: {
        priv_key: string;
        pub_key: string;
    };
    active: {
        priv_key: string;
        pub_key: string;
    };
}
export interface ECCMessage {
    username: string;
}
export interface WireActionDigest {
    digest: Buffer;
    digest_str: string;
    eth_digest: string;
    trx: PushTransactionArgs;
}
export interface ChainServiceOptions {
    endpoint: string;
    privateKeys?: string[];
    hyperion?: string;
}
export interface V1ChainInfo {
    server_version: string;
    chain_id: string;
    head_block_num: number;
    last_irreversible_block_num: number;
    last_irreversible_block_id: string;
    head_block_id: string;
    head_block_time: string;
    head_block_producer: string;
    virtual_block_cpu_limit: number;
    virtual_block_net_limit: number;
    block_cpu_limit: number;
    block_net_limit: number;
    server_version_string: string;
    fork_db_head_block_num: number;
    fork_db_head_block_id: string;
    server_full_version_string: string;
}
