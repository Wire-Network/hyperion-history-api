export declare const IPFS_GATEWAY: string;
export declare const IPFS_OG: string;
export declare const IPFS_SUFFIX: string;
export declare const WIRE_API = "https://api.airwire.io/";
export interface AccountQuery {
    match?: string;
    collection_name?: string[];
    schema_name?: string[];
    hide_offers?: boolean;
    ids?: string[];
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
}
export interface AssetQuery {
    collection_name?: string[];
    schema_name?: string[];
    owner?: string[];
    burned?: boolean;
    match_immutable_name?: string;
    collection_whitelist?: string[];
    hide_offers?: boolean;
    ids?: string[];
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'asset_id' | 'minted' | 'updated' | 'transferred' | 'name';
}
export interface TransferQuery {
    asset_id?: string[];
    account?: string[];
    sender?: string[];
    recipient?: string[];
    collection_name?: string[];
    schema_name?: string[];
    collection_whitelist?: string[];
    memo?: string;
    match_memo?: string;
    hide_contracts?: boolean;
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
}
export interface OfferQuery {
    account?: string[];
    sender?: string[];
    memo?: string;
    match_memo?: string;
    recipient?: string[];
    is_recipient_contract?: boolean;
    asset_id?: string[];
    collection_name?: string[];
    schema_name?: string[];
    account_whitelist?: string[];
    collection_whitelist?: string[];
    sender_asset_whitelist?: string[];
    recipient_asset_whitelist?: string[];
    hide_contracts?: boolean;
    hide_empty_offers?: boolean;
    ids?: string[];
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'created' | 'updated';
    state?: 0 | 1 | 2 | 3 | 4 | 5;
}
export interface SalesQuery {
    collection_name?: string[];
    schema_name?: string[];
    owner?: string[];
    buyer?: string[];
    seller?: string[];
    asset_id?: string;
    burned?: boolean;
    match_immutable_name?: string;
    collection_whitelist?: string[];
    hide_offers?: boolean;
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'created' | 'updated' | 'sale_id' | 'price' | 'name';
}
export interface CollectionQuery {
    author?: string[];
    match?: string;
    authorized_account?: string;
    collection_whitelist?: string[];
    ids?: string[];
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'created' | 'collection_name';
}
export interface SchemaQuery {
    collection_name?: string[];
    schema_name?: string;
    match?: string;
    collection_whitelist?: string[];
    ids?: string[];
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'created' | 'schema_name';
}
export interface AuctionQuery {
    bidder?: string;
    participant?: string;
    hide_empty_auctions?: boolean;
    show_seller_contracts?: boolean;
    asset_id?: string;
    symbol?: string;
    account?: string;
    buyer?: string[];
    seller?: string[];
    min_price?: number;
    max_price?: number;
    collection_name?: string[];
    schema_name?: string[];
    burned?: boolean;
    owner?: string[];
    match_immutable_name?: string;
    collection_whitelist?: string[];
    lower_bound?: string;
    upper_bound?: string;
    before?: number;
    after?: number;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sort?: 'created' | 'updated' | 'ending' | 'auction_id' | 'price';
    state?: 0 | 1 | 2 | 3 | 4 | number[];
}
export interface WireAsset {
    asset_id: string;
    auctions: {
        market_contract: 'wire.market';
        auction_id: string;
    }[];
    auction?: WireAuction;
    backed_tokens: [];
    burned_at_block: null | string;
    burned_at_time: null | string;
    burned_by_account: null | string;
    collection: WireCollection;
    contract: string;
    data: AttributeValueMap;
    immutable_data: AttributeValueMap;
    is_burnable: boolean;
    is_transferable: boolean;
    minted_at_block: string;
    minted_at_time: string;
    mutable_data: Record<string, any>;
    name: string;
    owner: string;
    sales: {
        market_contract: 'wire.market';
        sale_id: string;
    }[];
    sale?: WireSale;
    chainSale?: ChainSale;
    schema: WireSchema;
    template: null;
    template_mint: string;
    transferred_at_block: string;
    transferred_at_time: string;
    updated_at_block: string;
    updated_at_time: string;
    edition_id?: number;
    mint_index?: number;
    minter?: string;
    thumbnail?: string;
}
export interface AssetHistory {
    type: 'log' | 'transfer' | 'sale' | 'offer';
    id: string;
    info: string;
    txid: string;
    date: Date;
    block: string;
    data?: ApiTransfer | WireSale | ApiOffer;
}
export interface WireSale {
    market_contract: 'wire.market';
    assets_contract: 'wire.nft';
    sale_id: string;
    seller: string;
    buyer: string;
    offer_id: string;
    price: {
        token_contract: string;
        token_symbol: string;
        token_precision: number;
        median: null;
        amount: string;
    };
    listing_price: string;
    listing_symbol: 'WIRE';
    assets: WireAsset[];
    maker_marketplace: 'airwire';
    taker_marketplace: null;
    collection_name: string;
    collection: WireCollection;
    is_seller_contract: false;
    updated_at_block: string;
    updated_at_time: string;
    created_at_block: string;
    created_at_time: string;
    state: number;
}
export interface WireSaleDictionary {
    [key: string]: WireSale;
}
export interface WireCollection {
    allow_notify: boolean;
    author: string;
    authorized_accounts: string[];
    collection_name: string;
    created_at_block: string;
    created_at_time: string;
    file: null | string;
    market_fee: number;
    name: string;
    notify_accounts: string[];
    imgLoaded?: boolean;
    data?: any;
}
export interface WireSchema {
    created_at_block: string;
    created_at_time: string;
    format: {
        name: string;
        type: string;
    }[];
    schema_name: string;
}
export interface ApiOwner {
    account: string;
    assets: string;
}
export interface ApiAccount {
    collections: {
        collection: WireCollection;
        assets: string;
    }[];
    templates: {
        collection_name: string;
        template_id: null;
        assets: string;
    }[];
    assets: string;
}
export interface ApiLog {
    log_id: string;
    name: string;
    data: any;
    txid: string;
    created_at_block: string;
    created_at_time: string;
}
export interface ApiTransfer {
    transfer_id: string;
    contract: string;
    sender_name: string;
    recipient_name: string;
    memo: string;
    txid: string;
    assets: WireAsset[];
    created_at_block: string;
    created_at_time: string;
}
export interface ApiOffer {
    contract: string;
    offer_id: string;
    sender_name: string;
    recipient_name: string;
    memo: string;
    state: number;
    txid: string;
    sender_assets: WireAsset[];
    recipient_assets: WireAsset[];
    is_sender_contract: boolean;
    is_recipient_contract: boolean;
    updated_at_block: string;
    updated_at_time: string;
    created_at_block: string;
    created_at_time: string;
}
export interface WireAuction {
    market_contract: 'wire.market';
    assets_contract: 'wire.nft';
    auction_id: string;
    seller: string;
    buyer: string;
    price: {
        token_contract: string;
        token_symbol: string;
        token_precision: number;
        amount: string;
    };
    assets: WireAsset[];
    bids: WireAuctionBid[];
    maker_marketplace: 'airwire';
    taker_marketplace: null;
    claimed_by_buyer: boolean;
    claimed_by_seller: boolean;
    collection: WireCollection;
    end_time: string;
    is_seller_contract: boolean;
    updated_at_block: string;
    updated_at_time: string;
    created_at_block: string;
    created_at_time: string;
    state: 0 | 1 | 2 | 3 | 4 | number[];
}
export interface WireAuctionBid {
    number: number;
    account: string;
    amount: string;
    created_at_block: string;
    created_at_time: string;
    txid: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T[];
    query_time: number;
}
export interface ApiResponseSingle<T> {
    success: boolean;
    data: T;
    query_time: number;
}
export interface AttributeValueMap {
    [key: string]: any;
}
export interface ChainSale {
    forSale: true;
    sale_id: string;
    seller: string;
    asset_id: string;
    offer_id: string;
    listing_price: string;
    settlement_symbol: string;
    collection_fee: number;
    asset_royalties: Royalty[];
}
export interface SaleDictionary {
    [key: string]: ChainSale;
}
export interface Royalty {
    fee: string;
    user: string;
}
export interface CollectionStats {
    items: number;
    owners: number;
    volume: number;
    floor: number;
    ceiling: number;
    sales: number;
    fee: number;
}
export interface WireCollectionStats {
    assets: string;
    burned: string;
    burned_by_template: [
        {
            burned: string;
            template_id: null;
        }
    ];
    burned_by_schema: [
        {
            burned: string;
            schema_name: string;
        }
    ];
    templates: string;
    schemas: string;
}
export interface WireStatsCollection {
    symbol: {
        token_symbol: 'WIRE';
        token_contract: 'eosio.token';
        token_precision: 8;
    };
    result: {
        contract: 'wire.nft';
        collection_name: string;
        volume: string;
        sales: string;
        name: string;
        img: string | null;
        author: string;
        allow_notify: boolean;
        authorized_accounts: [];
        notify_accounts: [];
        market_fee: number;
        data: any;
        created_at_time: string;
        created_at_block: string;
    };
}
export interface WirePriceSale {
    auction_id: null | number;
    block_time: string;
    buyoffer_id: null | number;
    price: string;
    sale_id: string;
    template_mint: null;
    token_contract: 'eosio.token';
    token_precision: 8;
    token_symbol: 'WIRE';
}
export interface TX_DATA {
    title: string;
    subtitle: string | boolean;
    memo: string;
    memoEnd: string;
    subicon?: string | null;
    icon?: string;
    color: string;
    trx: any;
}
