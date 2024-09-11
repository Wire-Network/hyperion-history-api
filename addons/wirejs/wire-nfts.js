"use strict";
/**
 * @module NftService
 * copyright defined in eosjs/LICENSE.txt
 */
// (window as any).global = window;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BANNER = exports.DEFAULT_PFP = exports.AIRWIRE_ACCOUNTS = exports.URL_REGEX = exports.COLLECTION_SCHEMA = exports.FILTERS = exports.MARKET_ACTIONS = exports.NftService = void 0;
const events_1 = require("events");
const axios_1 = __importDefault(require("axios"));
const wire_utils_1 = require("./wire-utils");
class NftService extends events_1.EventEmitter {
    API;
    constructor(api) {
        super();
        // Can provide a custom API URL, defaults to the AirWire API.
        this.API = api ? api : 'https://fn.airwire.io/';
    }
    // ########## ASSETS ##########
    /**
     * Retrieves asset details based on the asset ID.
     *
     * @param {string} asset_id - The unique identifier for the asset.
     * @returns {Promise<WireAsset>} - A promise that resolves to the asset details.
     * https://fn.airwire.io/docs/#/assets/get_wireassets_v1_assets__asset_id_
     */
    async getAsset(asset_id) {
        const ENDPOINT = `wiremarket/v1/assets/${asset_id}`;
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT);
            const a = response.data.data;
            if (a.sales && a.sales.length) {
                a.sale = await this.getSaleID(a.sales[0].sale_id);
            }
            if (a.auctions && a.auctions.length) {
                a.auction = await this.getAuctionID(a.auctions[0].auction_id);
            }
            return a;
        }
        catch (err) {
            throw new Error(`Error retrieving asset: ${err.message}`);
        }
    }
    /**
     * Retrieves multiple assets based on a query, if query is left out default retrieves 100 unfilted assets. It also maps sales to the assets.
     *
     * @param {AssetQuery} [query] - The query parameters to filter the assets.
     * @returns {Promise<WireAsset[]>} - A promise that resolves to a list of assets, with sales mapped to each asset.
     */
    async getAssets(query) {
        const ENDPOINT = 'wiremarket/v1/assets';
        try {
            const PARAMS = query ? this.buildParams(query) : '';
            const response = await axios_1.default.get(this.API + ENDPOINT + PARAMS);
            const sale_ids = response.data.data.map(a => a.sales && a.sales.length ? a.sales[0].sale_id : null);
            const sales = await this.getSalesID(sale_ids);
            response.data.data.forEach(a => {
                a.sale =
                    a.sales && a.sales.length
                        ? sales[a.sales[0].sale_id]
                        : undefined;
            });
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving assets: ${err.message}`);
        }
    }
    /**
     * Retrieves the logs for an asset.
     *
     * @param {string} asset_id - The unique identifier for the asset.
     * @returns {Promise<ApiLog[]>} - A promise that resolves to the list of logs for the asset.
     * @see https://fn.airwire.io/docs/#/assets/get_wiremarket_v1_assets__asset_id__logs
     */
    async getAssetLogs(asset_id) {
        const ENDPOINT = `wiremarket/v1/assets/${asset_id}/logs`;
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving asset logs: ${err.message}`);
        }
    }
    // ########## COLLECTIONS ##########
    /**
     * Retrieves collection details based on the collection name.
     *
     * @param {string} name - The name of the collection.
     * @returns {Promise<WireCollection>} - A promise that resolves to the collection details.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    async getCollection(name) {
        const ENDPOINT = `wireassets/v1/collections/${name}`;
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving collection: ${err.message}`);
        }
    }
    /**
     * Retrieves multiple collections based on the query.
     *
     * @param {CollectionQuery} query - The query parameters.
     * @returns {Promise<WireCollection[]>} - A promise that resolves to an array of collections.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    async getCollections(query) {
        const ENDPOINT = 'wireassets/v1/collections';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT + PARAMS);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving collections: ${err.message}`);
        }
    }
    /**
     * Retrieves statistics of a collection.
     *
     * @param {string} name - The name of the collection.
     * @returns {Promise<WireCollection[]>} - A promise that resolves to collection stats.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    async getCollectionStats(name) {
        const ENDPOINT = `wireassets/v1/collections/${name}/stats`;
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving collection stats: ${err.message}`);
        }
    }
    /**
     * Retrieves detailed statistics of a collection.
     *
     * @param {string} name - The name of the collection.
     * @returns {Promise<WireStatsCollection>} - A promise that resolves to detailed collection stats.
     * @see https://fn.airwire.io/docs/#/collections/get_wiremarket_v1_collections
     */
    async getStatsCollection(name) {
        const ENDPOINT = `wiremarket/v1/stats/collections/${name}?symbol=WIRE`;
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving detailed collection stats: ${err.message}`);
        }
    }
    /**
     * Retrieves comprehensive statistics of a collection.
     *
     * @param {string} collection_name - The name of the collection.
     * @returns {Promise<CollectionStats>} - A promise that resolves to comprehensive collection stats.
     */
    async getCollectionStatsAll(collection_name) {
        try {
            const priceSales = await this.getPricesSales(collection_name);
            const colStats = await this.getCollectionStats(collection_name);
            const owners = await this.getAccounts({
                collection_name: [collection_name],
                limit: 5000,
            });
            const statsCollection = await this.getStatsCollection(collection_name);
            const stats = {
                items: +colStats.assets,
                owners: owners.length,
                volume: +statsCollection.result.volume / 100000000,
                floor: priceSales.length
                    ? +priceSales.sort((a, b) => +a.price - +b.price)[0].price /
                        100000000
                    : 0,
                ceiling: priceSales.length
                    ? +priceSales.sort((a, b) => +b.price - +a.price)[0].price /
                        100000000
                    : 0,
                sales: priceSales.length,
                fee: statsCollection.result.market_fee * 100,
            };
            return stats;
        }
        catch (err) {
            throw new Error(`Error retrieving comprehensive collection stats: ${err.message}`);
        }
    }
    // ########## SALES ##########
    /**
     * Retrieves pricing and sales information for a collection.
     *
     * @param {string} collection_name - The name of the collection.
     * @returns {Promise<WirePriceSale[]>} - A promise that resolves to an array of price and sales information.
     * @see https://fn.airwire.io/docs/#/pricing/get_wiremarket_v1_prices_sales
     */
    async getPricesSales(collection_name) {
        const ENDPOINT = `wiremarket/v1/prices/sales?collection_name=${collection_name}`;
        try {
            const response = await axios_1.default.get(this.API + ENDPOINT);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving pricing and sales information: ${err.message}`);
        }
    }
    // ######### SCHEMAS #########
    /**
     * Retrieves schema information based on a query.
     *
     * @param {SchemaQuery} [query] - The query parameters for filtering schemas.
     * @returns {Promise<WireSchema[]>} - A promise that resolves to an array of schema information.
     * @see https://fn.airwire.io/docs/#/schemas/get_wiremarket_v1_schemas
     */
    async getSchemas(query) {
        const ENDPOINT = 'wireassets/v1/schemas';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving schemas: ${err.message}`);
        }
    }
    // ########## OFFERS ##########
    /**
     * Retrieves offer information based on a query.
     *
     * @param {OfferQuery} [query] - The query parameters for filtering offers.
     * @returns {Promise<ApiOffer[]>} - A promise that resolves to an array of offer information.
     * @see https://fn.airwire.io/docs/#/offers/get_wiremarket_v1_offers
     */
    async getOffers(query) {
        const ENDPOINT = `wiremarket/v1/offers`;
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving offers: ${err.message}`);
        }
    }
    // ######## TRANSFERS #########
    /**
     * Retrieves transfer information based on a query.
     *
     * @param {TransferQuery} [query] - The query parameters for filtering transfers.
     * @returns {Promise<ApiTransfer[]>} - A promise that resolves to an array of transfer information.
     * @see https://fn.airwire.io/docs/#/assets/get_wiremarket_v1_assets__asset_id__logs
     */
    async getTransfers(query) {
        const ENDPOINT = 'wiremarket/v1/transfers';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving transfers: ${err.message}`);
        }
    }
    // ######### ACCOUNTS #########
    /**
     * Retrieves accounts based on the query parameters. If left out, retrieves 100 unfiltered accounts.
     *
     * @param {AccountQuery} [query] - The query parameters for filtering accounts.
     * @returns {Promise<ApiOwner[]>} - A promise that resolves to an array of account owners.
     * @see https://fn.airwire.io/docs/#/accounts/get_wireassets_v1_accounts
     */
    async getAccounts(query) {
        const ENDPOINT = 'wireassets/v1/accounts';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving accounts: ${err.message}`);
        }
    }
    /**
     * Retrieves details for a specific account.
     *
     * @param {string} username - The username for the account to retrieve.
     * @returns {Promise<ApiAccount>} - A promise that resolves to the account details.
     * @see https://fn.airwire.io/docs/#/accounts/get_wireassets_v1_accounts__account_
     */
    async getAccount(username) {
        const ENDPOINT = `wireassets/v1/accounts/${username}`;
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving account details: ${err.message}`);
        }
    }
    // ########## SALES ##########
    /**
     * Retrieves sales based on query parameters and maps them to their corresponding assets. If query left out, retrieves 100 unfiltered sales.
     *
     * @param {SalesQuery} [query] - The query parameters for filtering sales.
     * @returns {Promise<WireAsset[]>} - A promise that resolves to an array of sales mapped to assets.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    async getSales(query) {
        const ENDPOINT = 'wiremarket/v1/sales';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            const assets = response.data.data.map(sale => {
                const asset = sale.assets[0];
                asset.sale = sale;
                return asset;
            });
            return assets;
        }
        catch (err) {
            throw new Error(`Error retrieving sales: ${err.message}`);
        }
    }
    /**
     * Retrieves raw sales based on the query parameters. If query left out, retrieves 100 unfiltered sales.
     *
     * @param {SalesQuery} [query] - The query parameters for filtering sales.
     * @returns {Promise<WireSale[]>} - A promise that resolves to an array of sales.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    async getRawSales(query) {
        const ENDPOINT = 'wiremarket/v1/sales';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving raw sales: ${err.message}`);
        }
    }
    /**
     * Retrieves a specific sale by its ID.
     *
     * @param {number | string} sale_id - The ID of the sale to retrieve.
     * @returns {Promise<WireSale>} - A promise that resolves to the sale details.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    async getSaleID(sale_id) {
        const ENDPOINT = `wiremarket/v1/sales/${sale_id}`;
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving sale by ID: ${err.message}`);
        }
    }
    /**
     * Retrieves multiple sales by their IDs and returns them as a dictionary.
     *
     * @param {(string | number | null)[]} sale_ids - An array of sale IDs to retrieve.
     * @returns {Promise<WireSaleDictionary>} - A promise that resolves to a dictionary of sales.
     * @see https://fn.airwire.io/docs/#/sales/get_wiremarket_v1_sales
     */
    async getSalesID(sale_ids) {
        const ENDPOINT = 'wiremarket/v1/sales';
        const PARAMS = `?ids=${sale_ids.filter(id => id != null).join(',')}`;
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            const dict = {};
            response.data.data.forEach(sale => {
                dict[sale.sale_id] = sale;
            });
            return dict;
        }
        catch (err) {
            throw new Error(`Error retrieving multiple sales by IDs: ${err.message}`);
        }
    }
    // ######### AUCTIONS #########
    /**
     * Retrieves a list of auctions based on the query parameters. If no query is provided, retrieves 100 unfiltered auctions.
     *
     * @param {AuctionQuery} [query] - The query parameters for filtering auctions.
     * @returns {Promise<WireAuction[]>} - A promise that resolves to an array of auctions.
     * @see https://fn.airwire.io/docs/#/accounts/get_wiremarket_v1_auctions
     */
    async getAuctions(query) {
        const ENDPOINT = 'wiremarket/v1/auctions';
        const PARAMS = query ? this.buildParams(query) : '';
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}${PARAMS}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving auctions: ${err.message}`);
        }
    }
    /**
     * Retrieves a specific auction by its ID.
     *
     * @param {string | number} auction_id - The ID of the auction to retrieve.
     * @returns {Promise<WireAuction>} - A promise that resolves to the auction details.
     * @see https://fn.airwire.io/docs/#/accounts/get_wiremarket_v1_auctions__auction_id_
     */
    async getAuctionID(auction_id) {
        const ENDPOINT = `wiremarket/v1/auctions/${auction_id}`;
        try {
            const response = await axios_1.default.get(`${this.API}${ENDPOINT}`);
            return response.data.data;
        }
        catch (err) {
            throw new Error(`Error retrieving auction by ID: ${err.message}`);
        }
    }
    /**
     * Retrieves the price of a specific auction.
     *
     * @param {WireAuction} a - The auction object.
     * @returns {number} - The current price of the auction.
     */
    getAuctionPrice(a) {
        if (a.bids.length) {
            const bids = a.bids.sort((a, b) => b.number - a.number);
            return (0, wire_utils_1.priceToPrecision)(bids[0].amount, a.price.token_precision);
        }
        else {
            return (0, wire_utils_1.priceToPrecision)(a.price.amount, a.price.token_precision);
        }
    }
    // ######### HELPERS #########
    /**
     * Retrieves the transaction ID from a block by its block number or ID.
     *
     * @param {string} block - The block number or ID.
     * @returns {Promise<string>} - A promise that resolves to the transaction ID.
     */
    async getrxIdFromBlock(block) {
        try {
            const res = await axios_1.default.get(`https://hyperwire.siliconswamp.info/v1/chain/get_block?block_num_or_id=${block}`);
            return res.data.transactions[0]?.trx?.id || '';
        }
        catch (err) {
            console.error(`Error retrieving transaction ID from block: ${err.message}`);
            return '';
        }
    }
    /**
     * Builds query parameters for a URL based on a query object.
     *
     * @param {any} query - The query object containing the parameters.
     * @returns {string} - The query parameters as a string.
     */
    buildParams(query) {
        let res = '?';
        for (const key of Object.keys(query)) {
            let param = '';
            if (Array.isArray(query[key])) {
                if (query[key].length) {
                    param = query[key].join(',');
                }
            }
            else if (query[key] !== undefined && query[key] !== '') {
                param = query[key];
            }
            if (param !== undefined && param !== '') {
                res += key + '=' + encodeURIComponent(param) + '&';
            }
        }
        return res.slice(0, -1);
    }
}
exports.NftService = NftService;
exports.MARKET_ACTIONS = [
    'createcol',
    'addcolauth',
    'remcolauth',
    'addnotifyacc',
    'remnotifyacc',
    'createschema',
    // "extendschema",
    'addedition',
    'mintasset',
    'burnasset',
    'transfer',
    'createoffer',
    'acceptoffer',
    'canceloffer',
    'declineoffer',
    'announcesale',
    'cancelsale',
    'purchasesale',
    'transfer',
];
exports.FILTERS = {
    sort: 'minted',
    order: 'desc',
    match_immutable_name: '',
    collection_whitelist: [],
    owner: [],
    page: 1,
    limit: 12,
    burned: false,
};
exports.COLLECTION_SCHEMA = [
    { name: 'external', type: 'string' },
    { name: 'icon', type: 'string' },
];
exports.URL_REGEX = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
exports.AIRWIRE_ACCOUNTS = ['airwire', 'wire.market'];
exports.DEFAULT_PFP = 'https://ipfs.fuego.airwire.io/QmWhb6JHc3A1T9nTgt2YzJtS5EpBG2utC4m1oxFbNiYqQF';
exports.DEFAULT_BANNER = 'https://ipfs.fuego.airwire.io/QmVjmcyGxGttHuRyVMSNAKX49b4vEHDzsfEN1sEy2XDmn5';
//# sourceMappingURL=wire-nfts.js.map