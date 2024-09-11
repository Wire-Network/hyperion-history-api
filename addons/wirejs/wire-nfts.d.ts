/**
 * @module NftService
 * copyright defined in eosjs/LICENSE.txt
 */
/// <reference types="node" />
import { EventEmitter } from 'events';
import { AccountQuery, ApiAccount, ApiLog, ApiOffer, ApiOwner, ApiTransfer, AssetQuery, AuctionQuery, CollectionQuery, CollectionStats, OfferQuery, SalesQuery, SchemaQuery, TransferQuery, WireAsset, WireAuction, WireCollection, WireCollectionStats, WirePriceSale, WireSale, WireSaleDictionary, WireSchema, WireStatsCollection } from './wire-nfts-interfaces';
export declare class NftService extends EventEmitter {
    API: string;
    constructor(api?: string);
    /**
     * Retrieves asset details based on the asset ID.
     *
     * @param {string} asset_id - The unique identifier for the asset.
     * @returns {Promise<WireAsset>} - A promise that resolves to the asset details.
     * https://fn.airwire.io/docs/#/assets/get_wireassets_v1_assets__asset_id_
     */
    getAsset(asset_id: string): Promise<WireAsset>;
    /**
     * Retrieves multiple assets based on a query, if query is left out default retrieves 100 unfilted assets. It also maps sales to the assets.
     *
     * @param {AssetQuery} [query] - The query parameters to filter the assets.
     * @returns {Promise<WireAsset[]>} - A promise that resolves to a list of assets, with sales mapped to each asset.
     */
    getAssets(query?: AssetQuery): Promise<WireAsset[]>;
    /**
     * Retrieves the logs for an asset.
     *
     * @param {string} asset_id - The unique identifier for the asset.
     * @returns {Promise<ApiLog[]>} - A promise that resolves to the list of logs for the asset.
     * @see https://fn.airwire.io/docs/#/assets/get_wiremarket_v1_assets__asset_id__logs
     */
    getAssetLogs(asset_id: string): Promise<ApiLog[]>;
    /**
     * Retrieves collection details based on the collection name.
     *
     * @param {string} name - The name of the collection.
     * @returns {Promise<WireCollection>} - A promise that resolves to the collection details.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    getCollection(name: string): Promise<WireCollection>;
    /**
     * Retrieves multiple collections based on the query.
     *
     * @param {CollectionQuery} query - The query parameters.
     * @returns {Promise<WireCollection[]>} - A promise that resolves to an array of collections.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    getCollections(query?: CollectionQuery): Promise<WireCollection[]>;
    /**
     * Retrieves statistics of a collection.
     *
     * @param {string} name - The name of the collection.
     * @returns {Promise<WireCollection[]>} - A promise that resolves to collection stats.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    getCollectionStats(name: string): Promise<WireCollectionStats>;
    /**
     * Retrieves detailed statistics of a collection.
     *
     * @param {string} name - The name of the collection.
     * @returns {Promise<WireStatsCollection>} - A promise that resolves to detailed collection stats.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    getStatsCollection(name: string): Promise<WireStatsCollection>;
    /**
     * Retrieves comprehensive statistics of a collection.
     *
     * @param {string} collection_name - The name of the collection.
     * @returns {Promise<CollectionStats>} - A promise that resolves to comprehensive collection stats.
     */
    getCollectionStatsAll(collection_name: string): Promise<CollectionStats>;
    /**
     * Retrieves pricing and sales information for a collection.
     *
     * @param {string} collection_name - The name of the collection.
     * @returns {Promise<WirePriceSale[]>} - A promise that resolves to an array of price and sales information.
     * @see https://fn.airwire.io/docs/#/pricing/get_wiremarket_v1_prices_sales
     */
    getPricesSales(collection_name: string): Promise<WirePriceSale[]>;
    /**
     * Retrieves schema information based on a query.
     *
     * @param {SchemaQuery} [query] - The query parameters for filtering schemas.
     * @returns {Promise<WireSchema[]>} - A promise that resolves to an array of schema information.
     * @see https://fn.airwire.io/docs/#/schemas/get_wiremarket_v1_schemas
     */
    getSchemas(query?: SchemaQuery): Promise<WireSchema[]>;
    /**
     * Retrieves offer information based on a query.
     *
     * @param {OfferQuery} [query] - The query parameters for filtering offers.
     * @returns {Promise<ApiOffer[]>} - A promise that resolves to an array of offer information.
     * @see https://fn.airwire.io/docs/#/offers/get_wiremarket_v1_offers
     */
    getOffers(query?: OfferQuery): Promise<ApiOffer[]>;
    /**
     * Retrieves transfer information based on a query.
     *
     * @param {TransferQuery} [query] - The query parameters for filtering transfers.
     * @returns {Promise<ApiTransfer[]>} - A promise that resolves to an array of transfer information.
     * @see https://fn.airwire.io/docs/#/assets/get_wiremarket_v1_assets__asset_id__logs
     */
    getTransfers(query?: TransferQuery): Promise<ApiTransfer[]>;
    /**
     * Retrieves accounts based on the query parameters. If left out, retrieves 100 unfiltered accounts.
     *
     * @param {AccountQuery} [query] - The query parameters for filtering accounts.
     * @returns {Promise<ApiOwner[]>} - A promise that resolves to an array of account owners.
     * @see https://fn.airwire.io/docs/#/accounts/get_wireassets_v1_accounts
     */
    getAccounts(query?: AccountQuery): Promise<ApiOwner[]>;
    /**
     * Retrieves details for a specific account.
     *
     * @param {string} username - The username for the account to retrieve.
     * @returns {Promise<ApiAccount>} - A promise that resolves to the account details.
     * @see https://fn.airwire.io/docs/#/accounts/get_wireassets_v1_accounts__account_
     */
    getAccount(username: string): Promise<ApiAccount>;
    /**
     * Retrieves sales based on query parameters and maps them to their corresponding assets. If query left out, retrieves 100 unfiltered sales.
     *
     * @param {SalesQuery} [query] - The query parameters for filtering sales.
     * @returns {Promise<WireAsset[]>} - A promise that resolves to an array of sales mapped to assets.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    getSales(query?: SalesQuery): Promise<WireAsset[]>;
    /**
     * Retrieves raw sales based on the query parameters. If query left out, retrieves 100 unfiltered sales.
     *
     * @param {SalesQuery} [query] - The query parameters for filtering sales.
     * @returns {Promise<WireSale[]>} - A promise that resolves to an array of sales.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    getRawSales(query?: SalesQuery): Promise<WireSale[]>;
    /**
     * Retrieves a specific sale by its ID.
     *
     * @param {number | string} sale_id - The ID of the sale to retrieve.
     * @returns {Promise<WireSale>} - A promise that resolves to the sale details.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    getSaleID(sale_id: number | string): Promise<WireSale>;
    /**
     * Retrieves multiple sales by their IDs and returns them as a dictionary.
     *
     * @param {(string | number | null)[]} sale_ids - An array of sale IDs to retrieve.
     * @returns {Promise<WireSaleDictionary>} - A promise that resolves to a dictionary of sales.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    getSalesID(sale_ids: (string | number | null)[]): Promise<WireSaleDictionary>;
    /**
     * Retrieves a list of auctions based on the query parameters. If no query is provided, retrieves 100 unfiltered auctions.
     *
     * @param {AuctionQuery} [query] - The query parameters for filtering auctions.
     * @returns {Promise<WireAuction[]>} - A promise that resolves to an array of auctions.
     * @see https://fn.airwire.io/docs/#/accounts/get_wiremarket_v1_auctions
     */
    getAuctions(query?: AuctionQuery): Promise<WireAuction[]>;
    /**
     * Retrieves a specific auction by its ID.
     *
     * @param {string | number} auction_id - The ID of the auction to retrieve.
     * @returns {Promise<WireAuction>} - A promise that resolves to the auction details.
     * @see https://fn.airwire.io/docs/#/accounts/get_wiremarket_v1_auctions__auction_id_
     */
    getAuctionID(auction_id: string | number): Promise<WireAuction>;
    /**
     * Retrieves the price of a specific auction.
     *
     * @param {WireAuction} a - The auction object.
     * @returns {number} - The current price of the auction.
     */
    getAuctionPrice(a: WireAuction): number;
    /**
     * Retrieves the transaction ID from a block by its block number or ID.
     *
     * @param {string} block - The block number or ID.
     * @returns {Promise<string>} - A promise that resolves to the transaction ID.
     */
    getrxIdFromBlock(block: string): Promise<string>;
    /**
     * Builds query parameters for a URL based on a query object.
     *
     * @param {any} query - The query object containing the parameters.
     * @returns {string} - The query parameters as a string.
     */
    buildParams(query: any): string;
}
export declare const MARKET_ACTIONS: string[];
export declare const FILTERS: AssetQuery | SalesQuery;
export declare const COLLECTION_SCHEMA: {
    name: string;
    type: string;
}[];
export declare const URL_REGEX: RegExp;
export declare const AIRWIRE_ACCOUNTS: string[];
export declare const DEFAULT_PFP = "https://ipfs.fuego.airwire.io/QmWhb6JHc3A1T9nTgt2YzJtS5EpBG2utC4m1oxFbNiYqQF";
export declare const DEFAULT_BANNER = "https://ipfs.fuego.airwire.io/QmVjmcyGxGttHuRyVMSNAKX49b4vEHDzsfEN1sEy2XDmn5";
