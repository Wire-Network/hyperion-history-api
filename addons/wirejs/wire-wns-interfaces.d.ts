/// <reference types="node" />
import { BigNumber, ContractReceipt, ethers } from 'ethers';
import { Authorization } from './eosjs-serialize';
import { Web3ConnectOptions } from './wire-connect-interfaces';
import { ChainServiceOptions } from './wire-chain-service-interfaces';
import { GetBlockHeaderStateResult, GetBlockResult } from './eosjs-rpc-interfaces';
declare const SupportedNetworks: {
    [key: string]: string;
};
export default SupportedNetworks;
export interface WireTransactionArgs {
    account: string;
    name: string;
    permission?: string;
    data: any;
    actor?: string;
}
export interface WNSDepositInfo {
    contract_addr: string;
    asset_type: SupportedAssetType;
    amount?: number;
    token_id?: number;
}
export type AccessList = Array<{
    address: string;
    storageKeys: Array<string>;
}>;
export interface EthTransaction {
    hash?: string;
    to?: string;
    from?: string;
    nonce: number;
    gasLimit: BigNumber;
    gasPrice?: BigNumber;
    data: string;
    value: BigNumber;
    chainId: number;
    r?: string;
    s?: string;
    v?: number;
    type?: number | null;
    accessList?: AccessList;
    maxPriorityFeePerGas?: BigNumber;
    maxFeePerGas?: BigNumber;
}
export interface SetPending {
    trx_id: Uint8Array;
    blockNum: number;
    sig: string;
    msg_digest: string;
}
export interface InitiateTrxData {
    to: string;
    from: Buffer;
    contractAddress: Buffer;
    assetType: SupportedAssetType;
}
export interface SettleLog {
    key: number;
    trx_status: number;
    to: string;
    eth_address: string;
    cont_address: string;
    trx_signature: string;
    trx_id: string;
    asset_type: SupportedAssetType;
    block_num: number;
    submitted_at: string;
}
export interface WNSTransferParams {
    to: string;
    contract_addr: Buffer | string;
    asset_type: SupportedAssetType;
    symbol?: string;
    amountWhole?: number;
    amountDecimal?: number;
    precision?: number;
    token_id?: number;
    transfer_memo?: string;
}
export interface WireSwapParams {
    symbol: string;
    receive_symbol: string;
    contract_addr: string;
    amountWhole: number;
    amountDecimal: number;
    precision: number;
}
export type Transfer = [ERC1155Transfer['type'], Omit<ERC1155Transfer, 'type'>] | [ERC721Transfer['type'], Omit<ERC721Transfer, 'type'>] | [ERC20Transfer['type'], Omit<ERC20Transfer, 'type'>];
export interface ERC1155Transfer extends TransferBase {
    type: 'erc1155transfer';
    contractAddress: Uint8Array;
    tokenId: number;
    amount: number;
}
export interface ERC721Transfer extends TransferBase {
    type: 'erc721transfer';
    contractAddress: Uint8Array;
    tokenId: number;
    symbol: string;
}
export interface ERC20Transfer extends TransferBase {
    type: 'erc20transfer';
    contractAddress: Uint8Array;
    amountWhole: number;
    amountDecimal: number;
    precision: number;
    symbol: string;
}
export interface TransferBase {
    to: string;
    from: string;
}
export interface WNSWithdrawInfo<T extends SupportedAssetType> {
    contract_addr: string;
    asset_type: T;
    withdraw_data: WithdrawTypeMap[T];
}
export type WithdrawTypeMap = {
    20: ERC20WithdrawParams;
    721: ERC721WithdrawParams;
    1155: ERC1155WithdrawParams;
};
export interface ERC20WithdrawParams {
    amountWhole: number;
    amountDecimal: number;
    precision: number;
    symbol: string;
}
export interface ERC721WithdrawParams {
    tokenId: number;
}
export interface ERC1155WithdrawParams {
    tokenId: number;
    amount: number;
}
export interface WithdrawOptions<T extends SupportedAssetType> {
    withdraw_data: WithdrawTypeMap[T];
    address: string;
    asset_type: T;
}
export interface WithdrawBlock {
    header: {
        header: {
            _timestamp: number;
            _producer: string;
            _confirmed: number;
            _previous: string;
            _txMroot: string;
            _actMroot: string;
            _scheduleVersion: number;
        };
        _blockMroot: string;
        _scheduleHash: string;
    };
    pointSigValues: {
        signer: string;
        v: number;
        r: string;
        s: string;
    };
    txLeafNodes: Array<string>;
    wTxData: {
        tx_sigs: Array<string>;
        packed_context_free_data: Array<any>;
        compression: number;
        packed_tx: string;
        status: number;
        cpu: number;
        net: number;
    };
    wIndex: number;
}
export interface WithdrawAction {
    account: string;
    name: string;
    authorization: Array<Authorization>;
    data: any;
}
export interface ERC721WithdrawAction extends WithdrawAction {
    data: {
        contractAddress: string;
        tokenId: number;
        to: string;
        from: string;
    };
}
export interface ERC1155WithdrawAction extends WithdrawAction {
    data: {
        contractAddress: string;
        tokenId: number;
        amount: number;
        to: string;
        from: string;
    };
}
export interface ERC20WithdrawAction extends WithdrawAction {
    data: {
        contractAddress: string;
        amountWhole: number;
        amountDecimal: number;
        precision: number;
        to: string;
        from: string;
    };
}
export interface InitWithdraw {
    initWithdrawalBlock: WithdrawBlock;
    withdrawAction: ERC20WithdrawAction | ERC721WithdrawAction | ERC1155WithdrawAction;
    submittedReceipt: SubmittedWithdrawReceipt;
}
export interface SubmittedEthWithdraw {
    trx_id: string;
    initWithdrawalBlock: WithdrawBlock;
    assetType: 20 | 721 | 1155;
    withdrawAction: ERC20WithdrawAction | ERC721WithdrawAction | ERC1155WithdrawAction;
    status: WithdrawStatus;
    cleared: number | Date;
    blockID: string;
    sigDigest: string;
    receipt: ContractReceipt;
}
export interface SubmittedWithdrawReceipt {
    trx_id: string;
    block_num: number;
    asset_type: SupportedAssetType;
    state: GetBlockHeaderStateResult;
    block: GetBlockResult;
}
export declare enum WithdrawStatus {
    SUBMITTED = 0,
    FINALIZED = 1
}
export interface ERC20Balance {
    balanceWhole: number;
    balanceDecimal: number;
    precision: number;
}
export interface ERC721Balance {
    tokenIds: number[];
}
export interface ERC1155Balance {
    tokenIdsToAmounts: ERC1155TokenIdToAmount[];
}
export interface ERC1155TokenIdToAmount {
    key: number;
    value: string;
}
type AssetTypeMap = {
    20: ERC20Balance;
    721: ERC721Balance;
    1155: ERC1155Balance;
};
type AssetBalanceMap<T extends SupportedAssetType> = AssetTypeMap[T];
export interface SettleBalance<T extends SupportedAssetType> {
    key: number;
    owner: string;
    cont_address: string;
    symbol: string;
    nftData?: ExplorerNFTAsset;
    balance: AssetBalanceMap<T>[];
    asset_type: T;
}
export interface ExplorerNFTAsset {
    animation_url: string | null;
    external_app_url: string | null;
    id: string;
    image_url: string;
    is_unique: boolean;
    metadata: ExplorerAssetMetadata;
    owner: ExplorerAssetOwner;
    token: ExplorerTokenDetails;
    token_type: string;
    value: string;
}
export interface ExplorerAssetMetadata {
    properties: ExplorerAssetProperties;
    title?: string;
    type?: string;
    description?: string;
    name?: string;
}
export interface ExplorerAssetProperties {
    attributes: {
        type: string;
    };
    collection: {
        description: string;
        name: string;
    };
    description: {
        description: string;
        type: string;
    };
    external_url: {
        description: string;
        type: string;
    };
    image: {
        description: string;
        type: string;
    };
    name: {
        description: string;
        type: string;
    };
}
export interface ExplorerAssetOwner {
    ens_domain_name: string | null;
    hash: string;
    implementation_name: string | null;
    is_contract: boolean;
    is_verified: boolean | null;
    name: string | null;
    private_tags: string[];
    public_tags: string[];
    watchlist_names: string[];
}
export interface ExplorerTokenDetails {
    address: string;
    circulating_market_cap: number | null;
    decimals: number | null;
    exchange_rate: number | null;
    holders: string;
    icon_url: string | null;
    name: string;
    symbol: string;
    total_supply: number | null;
    type: string;
}
export interface AuthMsgLink {
    key: number;
    account_name: string;
    pub_key: string;
    eth_address: number[] | Uint8Array;
    address?: string;
    comp_key: string;
}
export interface WnsOptions {
    chainOptions: ChainServiceOptions;
    web3Options?: Web3ConnectOptions;
}
export interface WireSystemAccount {
    account_name: string;
    head_block_num: number;
    head_block_time: string;
    privileged: false;
    last_code_update: string;
    created: string;
    ram_quota: number;
    net_weight: number;
    cpu_weight: number;
    net_limit: {
        used: number;
        available: number;
        max: number;
    };
    cpu_limit: {
        used: number;
        available: number;
        max: number;
    };
    ram_usage: number;
    permissions: AccountPermission[];
    total_resources: {
        owner: string;
        net_weight: string;
        cpu_weight: string;
        ram_bytes: number;
    };
    self_delegated_bandwidth: number | null;
    refund_request: number | null;
    voter_info: number | null;
    rex_info: number | null;
    subjective_cpu_bill_limit: {
        used: number;
        available: number;
        max: number;
    };
}
export interface WireSystemAccountV2 {
    query_time_ms: number;
    account: WireSystemAccount;
    links: any[];
    tokens: AccountToken[];
    total_actions: number;
    actions: AccountAction[];
}
export interface AccountPermission {
    perm_name: string;
    parent: string;
    required_auth: {
        threshold: number;
        keys: AccountKey[];
        accounts: any[];
        waits: any[];
    };
}
export interface AccountKey {
    key: string;
    weight: number;
}
export interface AccountToken {
    symbol: string;
    precision: number;
    amount: number;
    contract: string;
}
export interface AccountAction {
    '@timestamp': string;
    timestamp: string;
    block_num: number;
    trx_id: string;
    act: {
        account: string;
        name: string;
        authorization: Authorization[];
        data: any;
    };
    notified: string[];
    cpu_usage_us: number;
    net_usage_words: number;
    account_ram_deltas: RamDelta[];
    global_sequence: number;
    receiver: string;
    producer: string;
    action_ordinal: number;
    creator_action_ordinal: number;
}
export interface RamDelta {
    account: string;
    delta: number;
}
export interface WnsPendingDepositInfo {
    setPending: SetPending;
    receipt: ethers.providers.TransactionReceipt;
}
export type SupportedAssetType = 20 | 721 | 1155;
export interface ApiWrapResult {
}
