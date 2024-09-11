"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WNS = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const wire_chain_service_1 = require("./wire-chain-service");
const ethers_1 = require("ethers");
const wire_wns_interfaces_1 = __importStar(require("./wire-wns-interfaces"));
const wire_asset_interface_1 = require("./wire-asset-interface");
const wire_utils_1 = require("./wire-utils");
const eosjs_serialize_1 = require("./eosjs-serialize");
const tx_1 = require("@ethereumjs/tx");
const utils_1 = require("ethers/lib/utils");
const wire_block_merkle_interface_1 = require("./wire-block-merkle-interface");
const wire_connect_1 = require("./wire-connect");
const hash = __importStar(require("hash.js"));
// Contract ABIs
const erc20_abi_1 = __importDefault(require("./contract_abis/eth/erc20.abi"));
const erc721_abi_1 = __importDefault(require("./contract_abis/eth/erc721.abi"));
const erc1155_abi_1 = __importDefault(require("./contract_abis/eth/erc1155.abi"));
const erc20withdraw_abi_1 = __importDefault(require("./contract_abis/eth/withdraw/erc20withdraw.abi"));
const erc721withdraw_abi_1 = __importDefault(require("./contract_abis/eth/withdraw/erc721withdraw.abi"));
const erc1155withdraw_abi_1 = __importDefault(require("./contract_abis/eth/withdraw/erc1155withdraw.abi"));
// Const Variables
const axios_1 = __importDefault(require("axios"));
const HYPERION = 'https://ht.wire.foundation/';
const PUB_KEY_MSG = 'Retrieve Public Key';
const WNS_API = 'https://wns-api.wire.foundation/';
const SETTLE_AUTH_ACTIONS = [
    'canceltrx',
    'initiatetrx',
    'setpending',
    'transfer',
    'withdraw1',
    'withdraw2',
    'withdraw3',
];
const ETH_WNS_BUCKET = '0xE26a3c4d1EC58d5Cda959CCE9624e392DdE3F70E';
const ERC20_WITHDRAW_CONTRACT = '0x92732502c1C88182E6D7AC372ac981D1a465f430';
const ERC721_WITHDRAW_CONTRACT = '0x29F2c2cC6699f845f88e340e0B3A3C582d58d00A';
const ERC1155_WITHDRAW_CONTRACT = '0x966340a3577d5BcA8d8212585C4Bb1f3a872e899';
/**
 * Represents the WNS (Wire Name Service) class, which is responsible for connecting to an Ethereum wallet,
 * managing the connection, and performing various actions related to the Wire blockchain via your Ethereum wallet prompts.
 *
 * NOTE: This class extends the ChainService class, which provides the base functionality for connecting to the Wire blockchain. Can initialize just ChainService if you don't need WNS functionality.
 *
 * @params wnsOptions Options required to initialize the WNS class. Includes the endpoints array for the Wire blockchain, and the options required to connect to an Ethereum wallet.
 */
class WNS extends wire_chain_service_1.ChainService {
    _eth_pub_key;
    _username;
    _account;
    web3Connect;
    link;
    options;
    get username() {
        if (this._username)
            return this._username;
        else if (this.web3Connect.address)
            return (0, wire_utils_1.addressToWireName)(this.web3Connect.address);
        else
            return undefined;
    }
    get wireAccount() {
        return this._account;
    }
    get pubKey() {
        return this._eth_pub_key;
    }
    get endpoint() {
        return this.rpc.endpoint;
    }
    constructor(wnsOptions) {
        // Initializes the Wire Chain Server with and array of valid endpoints. Will connect to the one with the lowest ms based on your location.
        super(wnsOptions.chainOptions);
        // Store options
        this.options = wnsOptions;
        // Initialize Web3 connection
        this.web3Connect = new wire_connect_1.Web3Connect(wnsOptions.web3Options);
        this.web3Connect.on('accountsChanged', async (addresses) => {
            if (addresses.length)
                this.initializeUserData(addresses[0]);
        });
    }
    /**
     * Calls web3 connect, then initializes the username, link, and system account
     *
     * @returns address of connected account from web3 connection
     */
    async connect() {
        const address = await this.web3Connect
            .connectWallet()
            .catch((err) => {
            throw new Error('Error connecting to Ethereum wallet: ', err);
        });
        if (address) {
            this.initializeUserData(address);
            return address;
        }
        else
            return undefined;
    }
    /**
     * Initializes the username, link, and system account
     *
     * @param address
     */
    async initializeUserData(address) {
        this._username = (0, wire_utils_1.addressToWireName)(address);
        await this.checkLink(address)
            .then((link) => (this.link = link))
            .catch(() => (this.link = undefined));
        await this.getSystemAccount(this._username)
            .then(acct => (this._account = acct))
            .catch(() => (this._account = undefined));
    }
    /**
     * Disconnects the Web3 connection and resets the _eth_pub_key, _username, link, and _account
     */
    disconnectWNS() {
        this._eth_pub_key = undefined;
        this._username = undefined;
        this.link = undefined;
        this._account = undefined;
        this.web3Connect.disconnect();
    }
    /**
     * Hits WNS API and register a new user account
     * @param wirePubKeyEM
     * @param ethAddress
     * @returns
     */
    async register(wirePubKeyEM, ethAddress) {
        if (!wirePubKeyEM.startsWith('PUB_EM'))
            throw new Error('Must send Wire PUB_EM key type');
        return axios_1.default
            .post(`${WNS_API}signup/account`, {
            public_key: wirePubKeyEM.toString(),
            address: ethAddress,
        })
            .catch((err) => {
            throw new Error(err.message);
        });
    }
    async retrievePubKey() {
        if (this.pubKey)
            return this.pubKey;
        else {
            const sig = await this.web3Connect
                .signWeb3Message(PUB_KEY_MSG)
                .catch((err) => {
                throw new Error(err);
            });
            this._eth_pub_key = this.getPubKey(PUB_KEY_MSG, sig);
            return this._eth_pub_key;
        }
    }
    /**
     * Check Link By Address
     * Checks the 'auth.msg' contract's 'links' table by address to see if the provided Ethereum address is linked to an EOS account.
     * Will use the connected wallet's address if no address is provided.
     *
     * @param address Optional Ethereum address to check the link status of, if not provided will use the connected wallet's address.
     * @returns The link status of the provided Ethereum address as seen in the 'auth.msg' contract's 'links' table.
     */
    checkLink(address) {
        return new Promise((resolve, reject) => {
            if (!address && !this.web3Connect.address) {
                reject(false);
                return;
            }
            if (!address)
                address = this.web3Connect.address;
            const username = (0, wire_utils_1.addressToWireName)(address);
            this.checkLinkByUsername(username)
                .then((res) => {
                resolve(res);
            })
                .catch((err) => {
                reject('No link found for address: ' +
                    this.web3Connect.address +
                    ' Error: ' +
                    err);
            });
        });
    }
    /**
     * Checks the 'auth.msg' contract's 'links' table by username to see if the provided EOS account is linked to an Ethereum address.
     * Will use the connected wallet's username if no username is provided.
     *
     * @param username Username to check the link status of, if not provided will use the connected wallet's username.
     * @returns The link status of the provided EOS account as seen in the 'auth.msg' contract's 'links' table.
     */
    checkLinkByUsername(username) {
        return new Promise((resolve, reject) => {
            if (!username && !this.username) {
                reject('No username provided or found.');
                return;
            }
            if (!username)
                username = this.username;
            this.getRows({
                contract: 'auth.msg',
                table: 'links',
                key_type: 'name',
                index_position: 2,
                lower_bound: username,
                upper_bound: username,
            })
                .then((res) => {
                if (res.rows.length) {
                    this.link = res.rows[0];
                    resolve(this.link);
                }
                else {
                    this.link = undefined;
                    reject('No link found for username: ' + username);
                }
            })
                .catch((err) => {
                this.link = undefined;
                reject('Error checking if account is linked: ' + err);
            });
        });
    }
    /**
     * Creates a link between the Ethereum account used to sign these transactions and the EOS account provided.
     * Once linked, the Ethereum account can sign transactions on behalf of the EOS account and will be granted the special 'auth.ext' permission.
     *
     * @param account_name EOS account name to link with Ethereum account.
     * @param pub_key Optional public key to use for linking. If not provided, will attempt to retrieve from Ethereum wallet.
     * @returns Returns the transaction receipts for the 'createlink' and 'linkauth' actions.
     */
    async createLink(username) {
        if (!this.web3Connect.connected)
            throw new Error("No Ethereum wallet found, 'WNS.connect' first.");
        // Step 1: Need users public key.
        if (!this.pubKey)
            await this.retrievePubKey().catch(err => {
                throw new Error(err);
            });
        if (!this._eth_pub_key)
            throw new Error('Failed to get public key from Ethereum wallet.');
        // Convert actions to digests and sign with Ethereum wallet, push singed transaction to wire
        const compressed = (0, wire_utils_1.getCompressedPublicKey)(this._eth_pub_key);
        const nonce = new Date().getTime();
        const msg_hash = ethers_1.ethers.utils.keccak256(new Uint8Array(Buffer.from(compressed + nonce + username)));
        const eth_sig = await this.web3Connect
            .signWeb3Message(msg_hash)
            .catch(err => {
            throw new Error(err);
        });
        const wire_sig = (0, wire_utils_1.evmSigToWIRE)(eth_sig);
        const create_link_receipt = await this.pushWireTransaction({
            account: 'auth.msg',
            name: 'createlink',
            permission: 'active',
            data: {
                sig: wire_sig,
                msg_hash: msg_hash.slice(2),
                nonce: nonce,
                account_name: username,
            },
        }).catch((err) => {
            throw new Error(err);
        });
        this.link = await this.checkLinkByUsername(username).catch();
        return create_link_receipt;
    }
    /**
     * Links the 'auth.ext' permission with the 'settle.wns' contract actions for a given user.
     * This is required for the user to perform actions on the 'settle.wns' contract.
     * Links actions: 'canceltrx', 'initiatetrx', 'setpending', 'transfer', 'withdraw1', 'withdraw2', 'withdraw3'.
     *
     * @param username Username of user to linkauth with WNS contract actions
     * @returns A Promise that resolves to the transaction receipt of the linkauth actions.
     * @throws Throws an error if the user is not connected to an Ethereum wallet.
     * @trhows Throws an error if the contract actions fail to linkauth.
     */
    async linkAuthExt(username) {
        if (!this.web3Connect.connected)
            throw new Error("No Ethereum wallet found, 'WNS.connect' first.");
        // Linking 'auth.ext' permission with WNS contract actions.
        const linkAuthActions = [];
        SETTLE_AUTH_ACTIONS.forEach(action => linkAuthActions.push({
            account: 'eosio',
            name: 'linkauth',
            authorization: [{ actor: username, permission: 'active' }],
            data: {
                account: username,
                code: 'settle.wns',
                type: action,
                requirement: 'auth.ext',
            },
        }));
        // Convert actions to digests and sign with Ethereum wallet, push singed transaction to wire
        const action_digest = await this.wireActionToDigest(linkAuthActions).catch(err => {
            throw new Error(err);
        });
        const eth_sig = await this.web3Connect
            .signWeb3Message(action_digest.digest_str)
            .catch(err => {
            throw new Error(err);
        });
        const wire_sig = (0, wire_utils_1.evmSigToWIRE)(eth_sig);
        const link_auth_receipt = (await this.pushSignedTransaction(action_digest.trx, wire_sig).catch((err) => {
            throw new Error("Error Linking Auths for 'auth.ext': ", err);
        }));
        this.link = await this.checkLinkByUsername(username).catch();
        return link_auth_receipt;
    }
    // -----*** WNS DEPOSITS ***-----
    /**
     * Step 1 of deposit flow of assets into the WNS Ecosystem. Initializes the deposit process by declaring intent to deposit assets, initializing a row in the 'settle.wns' contract's logs table.
     *
     * Note: This is the first step in the deposit process and can be cancelled if the transaction is not set to 'pending' in the Wire logs table. Users may only have a set number of initiated transactions at a time.
     *
     * @param token_addr Contract address of the token being deposited.
     * @param asset_type The type of asset being deposited (20, 721, 1155).
     * @returns Returns the transaction receipt from the Wire network.
     */
    async depositInitiate(token_addr, asset_type) {
        if (!this.web3Connect.connected)
            throw new Error("No Ethereum wallet found, 'WNS.connect' first.");
        if (token_addr.includes('0x'))
            token_addr = token_addr.slice(2);
        const data = {
            to: this.username,
            from: Buffer.from(this.web3Connect.address.slice(2), 'hex'),
            contractAddress: Buffer.from(token_addr, 'hex'),
            assetType: asset_type,
        };
        const action = {
            account: 'settle.wns',
            name: 'initiatetrx',
            data,
            authorization: [
                {
                    actor: data.to,
                    permission: 'auth.ext',
                },
            ],
        };
        // Format Wire Action
        const init_digest = await this.wireActionToDigest(action).catch(err => {
            throw new Error(err);
        });
        // Sign the Wire Action with Ethereum wallet.
        const init_eth_sig = await this.web3Connect
            .signWeb3Message(init_digest.digest_str)
            .catch(err => {
            throw new Error(err);
        });
        // Convert signature to WIRE format.
        const init_wire_sig = (0, wire_utils_1.evmSigToWIRE)(init_eth_sig);
        // Push the signed 'init' transaction to the Wire network and wait for receipt. Declares intent to deposit and will set trx status to 0 (initiated). ( Still a cancellable state in the Wire logs table. )
        return await this.pushSignedTransaction(init_digest.trx, init_wire_sig).catch((err) => {
            throw new Error(err);
        });
    }
    /**
     * Step 2 of deposit flow. Transfers assets from the user's Ethereum wallet to the WNS Bucket.
     *
     * NOTE: IMPORTANT! This step is irreversible and will transfer assets to the WNS Bucket. Make sure 'setPending' data which is returned is SAVED, for use in Step 3: Set Pending, to kick off deposit validation.
     *
     * @param deposit_info Information required to deposit assets into the WNS Bucket.
     * @returns Returns the SetPending data required to set the transaction to 'pending' in the Wire logs table (kicking off deposit validation) and the Ethereum Transaction Receipt.
     */
    async depositToEthBucket(deposit_info) {
        if (!this.web3Connect.connected)
            throw new Error("No Ethereum wallet found, 'WNS.connect' first.");
        // Transfer assets to bucket, call different contract methods based on asset type.
        switch (deposit_info.asset_type) {
            case 20:
                if (deposit_info.amount == undefined)
                    throw new Error('Amount required for depositing ERC20 tokens.');
                return await this.depositErc20ToBucket(deposit_info.contract_addr, deposit_info.amount).catch(err => {
                    throw new Error(err);
                });
            case 721:
                if (deposit_info.token_id == undefined)
                    throw new Error('Token ID required for depositing ERC721 tokens.');
                return await this.depositNftToBucket(deposit_info.asset_type, deposit_info.token_id, deposit_info.contract_addr, deposit_info.amount).catch(err => {
                    throw new Error(err);
                });
            case 1155:
                if (deposit_info.amount == undefined ||
                    deposit_info.token_id == undefined)
                    throw new Error('Amount and Token ID required for depositing ERC1155 tokens.');
                return await this.depositNftToBucket(deposit_info.asset_type, deposit_info.token_id, deposit_info.contract_addr, deposit_info.amount).catch(err => {
                    throw new Error(err);
                });
            default:
                throw new Error('Invalid asset type provided.');
        }
    }
    /**
     * Step 3 of deposit flow. Sets the transaction to 'pending' in the Wire logs table. This is the final step in the deposit process and starts the deposit validation process.
     *
     * Note: Will need to provide the primary key of the appropriate 'logs' table row, in the 'settle.wns' contract. This can be fetched from the 'logs' table in the 'settle.wns' contract use 'getAllInitedByName' or 'getAllInitedByAddr'.
     *
     * @param key The primary key of the initiated transaction in the 'logs' table.
     * @param pending_data Data required to set the transaction to 'pending' in the Wire logs table. Got from Step 2: Deposit to Eth Bucket.
     * @returns Returns the transaction receipt from the Wire network.
     */
    async depositSetPending(key, pending_data) {
        if (!this.web3Connect.connected)
            throw new Error("No Ethereum wallet found, 'WNS.connect' first.");
        const data = { ...pending_data, key };
        const action = {
            account: 'settle.wns',
            name: 'setpending',
            data,
            authorization: [
                {
                    actor: this.username,
                    permission: 'auth.ext',
                },
            ],
        };
        // Format Wire Action
        const set_pending_digest = await this.wireActionToDigest(action).catch(err => {
            throw new Error(err);
        });
        // Sign the Wire Action with Ethereum wallet.
        const set_pending_eth_sig = await this.web3Connect
            .signWeb3Message(set_pending_digest.digest_str)
            .catch(err => {
            throw new Error(err);
        });
        // Convert signature to WIRE format.
        const set_pending_wire_sig = (0, wire_utils_1.evmSigToWIRE)(set_pending_eth_sig);
        // Push the signed 'setpending' transaction to the Wire network and wait for receipt. The deposit will then be validated, and balance updated accordingly.
        return (await this.pushSignedTransaction(set_pending_digest.trx, set_pending_wire_sig).catch((err) => {
            throw new Error(err);
        }));
    }
    /**
     * Cancels an initiated deposit by key. Will cancel the deposit if the transaction is still in the 'initiated' state (0) in Settle WNS.
     *
     * @param logKey The primary key of the initiated transaction in the 'logs' table.
     * @returns Returns the transaction receipt for the 'canceltrx' action.
     */
    async cancelInitiatedDeposit(logKey) {
        const action = {
            account: 'settle.wns',
            name: 'canceltrx',
            data: { key: logKey },
            authorization: [{ actor: this.username, permission: 'auth.ext' }],
        };
        const action_digest = await this.wireActionToDigest(action).catch(err => {
            throw new Error(err);
        });
        const eth_sig = await this.web3Connect
            .signWeb3Message(action_digest.digest_str)
            .catch(err => {
            throw new Error(err);
        });
        const wire_sig = (0, wire_utils_1.evmSigToWIRE)(eth_sig);
        return (await this.pushSignedTransaction(action_digest.trx, wire_sig).catch((err) => {
            throw new Error("Error Linking Auths for 'auth.ext': ", err);
        }));
    }
    // -----*** WNS TRANSFERS ***-----
    /**
     * Transfers WNS tokens from one EOS account to another. Will use wrapped tokens first if possible, otherwise will wrap what is required from 'settle.wns' balance. Total balance will be checked first to ensure enough tokens are available.
     *
     * Note: No wrap mechanism built for NFTs yet. Will need to be implemented. Currently transfers only unwrapped NFTs ( basic 'settle.wns' contract transfer call. )
     *
     * @params transfer_info Basic transfer information required to transfer assets between EOS accounts.
     * @returns A transaction receipt from the Wire network of the final transfer call.
     *
     * TODO: Wrap mechanism hasn't be created for NFTs yet. Will need to be implemented. Once that is done you will wrap then native Wire NFT transfer.
     */
    async wnsTransfer(transfer_info) {
        // Do checks on input data based on asset_type being transferred.
        if (!this.web3Connect.connected)
            throw new Error('No Ethereum account connected.');
        // Convert buffer to string if necessary, chop 0x
        if (typeof transfer_info.contract_addr !== 'string')
            transfer_info.contract_addr =
                transfer_info.contract_addr.toString('hex');
        if (transfer_info.contract_addr.startsWith('0x'))
            transfer_info.contract_addr = transfer_info.contract_addr.slice(2);
        // Get WNS settle balance for passed contract address.
        const wns_settle_balance = await this.getSettleBalance(transfer_info.contract_addr).catch(err => {
            throw new Error(err);
        });
        // Convert contract address to Buffer
        const cont_addr_buff = Buffer.from(transfer_info.contract_addr, 'hex');
        let action_to_push;
        switch (transfer_info.asset_type) {
            case 20:
                // Check if all required fields are present for ERC20 transfers.
                if (transfer_info.amountWhole === undefined ||
                    transfer_info.amountDecimal === undefined ||
                    transfer_info.precision === undefined ||
                    transfer_info.symbol === undefined)
                    throw new Error("'amountWhole', 'amountDecimal', 'precision', and 'symbol' all required for ERC20 transfers.");
                // TODO: Verify Swap pool exists for swap transfers.
                // Need to get both WNS balance and Wire balance.
                // Get Wire balance. Should be in the format of ['10.0000 USDC'] a.k.a ['amountWhole.amountDecimal symbol']
                const wire_token_balance = await this.getWireTokenBalance(transfer_info.symbol).catch(err => { });
                const wire_balance_asset = wire_token_balance && wire_token_balance.length
                    ? new wire_asset_interface_1.UpapAsset(wire_token_balance[0])
                    : new wire_asset_interface_1.UpapAsset('0', 4, transfer_info.symbol);
                // TODO: Get wire token precision in a better way? Default to 4
                // Store receive token precision for wire network wrapped token, should be 4 (e.g. 10.0000 USDC)
                const receive_token_precision = wire_balance_asset.precision;
                // Update precision of wire balance to match transfer precision for comparison
                wire_balance_asset.updatePrecision(transfer_info.precision);
                // Initialize asset variable for amount requested to receive in the swap
                const transfer_asset = new wire_asset_interface_1.UpapAsset(`${transfer_info.amountWhole}.${transfer_info.amountDecimal}`, transfer_info.precision, transfer_info.symbol);
                // WRAP if Wire balance is not enough to fulfill the transfer.
                if (wire_balance_asset.value < transfer_asset.value) {
                    // If no balance row found, insufficient balance since Wire balance isn't enough. Reject
                    if (!wns_settle_balance.length)
                        throw new Error('No WNS Settle balance found to fulfill transfer.');
                    const wns_erc20_balance = wns_settle_balance[0]
                        .balance[1];
                    const wns_balance_asset = new wire_asset_interface_1.UpapAsset(`${wns_erc20_balance.balanceWhole}.${wns_erc20_balance.balanceDecimal}`, transfer_info.precision, transfer_info.symbol);
                    // Calculate the difference between the amount requested and the Wire balance.
                    const differenceToWrap = transfer_asset.subtract(wire_balance_asset);
                    const [whole_diff, decimal_diff] = differenceToWrap.splitValues();
                    // If wns balance is less than needed to wrap, throw error insufficient balance.
                    if (wns_balance_asset.value < differenceToWrap.value)
                        throw new Error('Insufficient WNS balance to fulfill transfer.');
                    else {
                        // If sufficient balance to wrap, perform wrap
                        const wrap_transfer = [
                            'erc20transfer',
                            {
                                contractAddress: cont_addr_buff,
                                amountWhole: +whole_diff,
                                amountDecimal: +decimal_diff,
                                precision: transfer_info.precision,
                                symbol: transfer_info.symbol,
                                to: 'wrapper',
                                from: this.username,
                            },
                        ];
                        // PERFORM WRAP
                        await this.wrap(wrap_transfer).catch((err) => {
                            throw new Error('Error Wrapping in transfer call: ', err);
                        });
                    }
                }
                transfer_asset.updatePrecision(receive_token_precision);
                console.log('Receive Asset Updated: ', transfer_asset, transfer_asset.toString());
                // We now have a sufficient Wire balance, do the eosio.token transfer call.
                action_to_push = {
                    account: 'eosio.token',
                    name: 'transfer',
                    actor: this.username,
                    permission: 'active',
                    data: {
                        from: this.username,
                        to: transfer_info.to,
                        quantity: transfer_asset.toString(),
                        memo: transfer_info.transfer_memo
                            ? transfer_info.transfer_memo
                            : 'WNS Transfer',
                    },
                };
                break;
            case 721:
                // Check if token_id is present for ERC721 transfers.
                if (transfer_info.token_id === undefined ||
                    transfer_info.symbol === undefined)
                    throw new Error("'token_id' and 'symbol' are required for ERC721 transfers.");
                // Check if settle balance for given token contract exists
                if (!wns_settle_balance.length)
                    throw new Error('No WNS Settle balance found to fulfill transfer.'); // TODO : Check if it exists in web3 balance, prompt web3 transfer?
                // Check if existing settle balance for given contract has the token ID.
                const erc721balance = wns_settle_balance[0]
                    .balance[1];
                if (!erc721balance.tokenIds.includes(transfer_info.token_id))
                    throw new Error(`TokenID: ${transfer_info.token_id} not found in WNS balance.`);
                action_to_push = {
                    account: 'settle.wns',
                    name: 'transfer',
                    permission: 'auth.ext',
                    data: {
                        assetParams: [
                            'erc721transfer',
                            {
                                contractAddress: cont_addr_buff,
                                tokenId: transfer_info.token_id,
                                to: transfer_info.to,
                                from: this.username,
                                symbol: transfer_info.symbol,
                            },
                        ],
                    },
                };
                break;
            case 1155:
                // Check if token_id & amountWhole are present for ERC1155 transfers.
                if (transfer_info.token_id === undefined ||
                    transfer_info.amountWhole === undefined)
                    throw new Error("'token_id' and 'amountWhole' all required for ERC1155 transfers.");
                // Check if settle balance for given token contract exists
                if (!wns_settle_balance.length)
                    throw new Error('No WNS Settle balance found to fulfill transfer.'); // TODO : Check if it exists in web3 balance, prompt web3 transfer?
                // 1155 being transferred. Check token id and amount.
                const erc1155balance = wns_settle_balance[0]
                    .balance[1];
                const token_bal = erc1155balance.tokenIdsToAmounts.find((t) => +t.key === +transfer_info.token_id).value;
                if (!token_bal)
                    throw new Error(`TokenID: ${transfer_info.token_id} not found in WNS balance.`);
                if (+token_bal < transfer_info.amountWhole)
                    throw new Error(`Insufficient balance for token ID: ${transfer_info.token_id}`);
                action_to_push = {
                    account: 'settle.wns',
                    name: 'transfer',
                    permission: 'auth.ext',
                    data: {
                        assetParams: [
                            'erc1155transfer',
                            {
                                contractAddress: cont_addr_buff,
                                tokenId: transfer_info.token_id,
                                amount: transfer_info.amountWhole,
                                to: transfer_info.to,
                                from: this.username,
                            },
                        ],
                    },
                };
                break;
            default:
                throw new Error('Invalid asset type provided.');
        }
        // console.log("Action to push: ", action_to_push);
        return await this.pushWireTransaction(action_to_push).catch(error => {
            throw new Error(error);
        });
    }
    /**
     * Swap assets between two different tokens on the Wire blockchain. Calls WNSTransfer to perform the swap.
     *
     * @param opts Options required to perform the swap between two tokens.
     * @returns transaction receipt from the Wire network for the transfer
     * @throws Throws an error if the swap transfer fails.
     */
    async swap(opts) {
        const swapTransfer = {
            to: 'swap.wns',
            contract_addr: opts.contract_addr,
            asset_type: 20,
            symbol: opts.symbol,
            amountWhole: opts.amountWhole,
            amountDecimal: opts.amountDecimal,
            precision: opts.precision,
            transfer_memo: opts.receive_symbol,
        };
        // Call WNS Transfer to 'swap.wns' contract.
        return await this.wnsTransfer(swapTransfer).catch((err) => {
            throw new Error(err);
        });
    }
    // -----*** WNS WITHDRAWS ***-----
    // ---- Helpers ----
    /**
     * Step 1 of Withdraw flow. Kicks off the withdraw process by calling withdraw action in the 'settle.wns' contract. With the resulting block data, the user can then call the 'submitEthWithdraw' as step 2.
     *
     * NOTE: Withdraw will pull from 'settle.wns' balance first, then if not enough, will unwrap the required amount from the Ethereum wallet ( In the case of ERC20s ).
     *
     * @params withdraw_info Information required to withdraw assets from the WNS Ecosystem.
     * @returns Formatted withdraw data, composed of wire withdraw transaction block data, to be submitted to the Ethereum contract.
     */
    async initializeWithdraw(withdraw_info) {
        if (!this.web3Connect.connected)
            throw new Error('No Ethereum account connected.');
        const address = withdraw_info.contract_addr.includes('0x')
            ? withdraw_info.contract_addr.slice(2)
            : withdraw_info.contract_addr;
        // Get the WNS balance for the user.
        const wns_balance = await this.getSettleBalance(address).catch((err) => {
            throw new Error(err);
        });
        // Validate users balance based on asset type.
        switch (withdraw_info.asset_type) {
            case 20: {
                // Cast the withdraw data to proper withdraw params.
                const withdraw_data = withdraw_info.withdraw_data;
                // Cast the balance to the proper balance type.
                const wns_bal = (wns_balance.length
                    ? wns_balance[0].balance[1]
                    : {
                        balanceWhole: 0,
                        balanceDecimal: 0,
                        precision: withdraw_data.precision,
                        symbol: withdraw_data.symbol,
                    });
                const wns_bal_asset = new wire_asset_interface_1.UpapAsset(`${wns_bal.balanceWhole.toString()}.${wns_bal.balanceDecimal}`, wns_bal.precision, withdraw_data.symbol);
                const withdraw_amnt_asset = new wire_asset_interface_1.UpapAsset(withdraw_data.amountWhole.toString() +
                    '.' +
                    withdraw_data.amountDecimal.toString(), withdraw_data.precision, withdraw_data.symbol);
                // Check if WNS balance is not enough to fulfill the withdraw.
                if (!wns_bal_asset
                    .subtract(withdraw_amnt_asset)
                    .greaterThan(0, true)) {
                    // Get the wire balance of the token, see if we can unwrap enough to fulfill order.
                    const wire_balance = await this.getWireTokenBalance(withdraw_data.symbol).catch((err) => {
                        throw new Error('Error getting Wire Balance: ', err);
                    });
                    if (!wire_balance.length)
                        throw new Error('No Wire balance found for user, not enough funds for withdraw.');
                    // wire_balance is in the form: ['10.0000 USDC'], we are taking the "amount"
                    const wire_bal = wire_balance[0].split(' ')[0];
                    // Make into Asset for easy calculations.
                    const wire_bal_asset = new wire_asset_interface_1.UpapAsset(wire_bal, withdraw_data.precision, withdraw_data.symbol);
                    const diff = withdraw_amnt_asset.subtract(wns_bal_asset);
                    // If Wire balance is enough to fulfill the withdraw, unwrap the difference.
                    if (wire_bal_asset.subtract(diff).greaterThan(0, true)) {
                        diff.updatePrecision(4);
                        await this.unwrap(diff, address).catch((err) => {
                            throw new Error('Error unwrapping in withdraw call: ', err);
                        });
                    }
                    else {
                        throw new Error('Insufficient balance to fulfill withdraw.');
                    }
                }
                break;
            }
            case 721: {
                // Cast the withdraw data to proper withdraw params.
                const withdraw_data = withdraw_info.withdraw_data;
                // Cast the balance to the proper balance type.
                const wns_bal = (wns_balance.length
                    ? wns_balance[0].balance[1]
                    : { tokenIds: [] });
                // Make sure the token ID being withdrawn is in the users WNS balance.
                if (!wns_bal.tokenIds.includes(withdraw_data.tokenId))
                    throw new Error(`Token ID: ${withdraw_data.tokenId} not found in WNS balance.`);
                break;
            }
            case 1155: {
                // Cast the withdraw data to proper withdraw params.
                const withdraw_data = withdraw_info.withdraw_data;
                // Cast the balance to the proper balanace type.
                const wns_bal = (wns_balance.length
                    ? wns_balance[0].balance[1]
                    : { tokenIdsToAmounts: {} });
                const wns_bal_token = wns_bal.tokenIdsToAmounts.find((t) => +t.key === +withdraw_data.tokenId);
                // Make sure the token ID being withdrawn is in the users WNS balance with enough supply.
                if (!wns_bal_token ||
                    +wns_bal_token.value < withdraw_data.amount)
                    throw new Error(`Token ID: ${withdraw_data.tokenId} insufficient balance.`);
                break;
            }
        }
        // Submit withdraw data, now that we have verified the user has enough balance to withdraw.
        const withdrawResult = await this.submitSettleWithdraw({
            withdraw_data: withdraw_info.withdraw_data,
            address: address,
            asset_type: withdraw_info.asset_type,
        }).catch((err) => {
            console.log('Error submitting settle withdraw: ', err);
            throw new Error(err);
        });
        if (!withdrawResult)
            return;
        // This has to happen right after the transaction submitted
        const { state, block } = await this.getPendingBlockState(withdrawResult.processed.block_num);
        if (!state || !block)
            throw new Error('Error getting pending block state...');
        // TODO refund settle balance ?????????????????? dear lord save us
        const submittedReceipt = {
            trx_id: withdrawResult.transaction_id,
            block_num: withdrawResult.processed.block_num,
            asset_type: withdraw_info.asset_type,
            state,
            block,
        };
        return submittedReceipt;
    }
    async getPendingBlockState(block_num) {
        const while_limit = 10;
        let while_at = 0;
        const while_delay = 500;
        let state = undefined;
        let block = undefined;
        while (while_at <= while_limit) {
            const res = await Promise.all([
                this.rpc.get_block_header_state(block_num),
                this.rpc.get_block(block_num),
            ]).catch(error => { });
            if (res && res[0] && res[1]) {
                const [s, b] = res;
                state = s;
                block = b;
                break;
            }
            await new Promise(res => {
                setTimeout(() => res(true), while_delay);
            });
            while_at++;
        }
        return { state, block };
    }
    /**
     * Step 2 of Withdraw flow. Submits the formatted withdraw action to the WNS Ethereum Contract, where a time-lock (challenge window) will be set for the withdraw to be processed. Time-lock period is to allow for validation of the withdraw on the EOS side, essentially a window to challenge the truth of the proposed transaction.
     *
     * Note: Time-lock period is set in the Ethereum contract. Once the time-lock period is over, 'finalize' must be called.
     *
     * @param withdraw Formatted withdraw data, composed of wire withdraw transaction block data, to be submitted to the Ethereum contract.
     * @returns Initial Withdraw data, along with some additional data from the Ethereum transaction.
     */
    async submitEthWithdraw(withdraw) {
        if (!this.web3Connect.connected)
            throw new Error('No Ethereum account connected.');
        const receipt = await this.initializeErcWithdraw(withdraw).catch((err) => {
            console.log('Error initializing withdraw: ', err);
            throw new Error(err);
        });
        try {
            // const receipt = await (<any>res).wait();
            const args = receipt.events[0].args;
            const sd = args.bSD;
            const id = args.bID;
            // Adds some data to the withdraw object for the finalize step.
            return Object.assign({
                trx_id: withdraw.submittedReceipt.trx_id,
                status: wire_wns_interfaces_1.WithdrawStatus.SUBMITTED,
                cleared: new Date(new Date().getTime() + 3600),
                blockID: id,
                sigDigest: sd,
                assetType: withdraw.submittedReceipt.asset_type,
                receipt,
            }, withdraw);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    /**
     * Step 3 of Withdraw flow. Finalizes the withdraw process by calling the 'withdraw' action on the ERC20Withdraw contract. This can be called once the time-lock period is over from step 2.
     *
     * @param key Block ID and Signature Digest returned from step 2 'submitEthWithdraw'.
     * @param withdrawAction The withdraw action formatted and returned from step 1 also returned in step 2.
     * @returns The transaction receipt from the Ethereum network.
     */
    async finalizeWithdraw(withdraw) {
        if (!this.web3Connect.connected)
            throw new Error('No Ethereum account connected.');
        try {
            if (!wire_wns_interfaces_1.default[this.web3Connect.chainID])
                throw new Error('CHAIN MISMATCH: Only supported chain currently' +
                    this.web3Connect.chainID);
            const signer = this.web3Connect.web3Provider.getSigner();
            let contractAddress = '';
            let contractABI = [];
            switch (withdraw.assetType) {
                case 20:
                    contractAddress = ERC20_WITHDRAW_CONTRACT;
                    contractABI = erc20withdraw_abi_1.default;
                    break;
                case 721:
                    contractAddress = ERC721_WITHDRAW_CONTRACT;
                    contractABI = erc721withdraw_abi_1.default;
                    break;
                case 1155:
                    contractAddress = ERC1155_WITHDRAW_CONTRACT;
                    contractABI = erc1155withdraw_abi_1.default;
                    break;
            }
            const WithdrawContract = new ethers_1.ethers.Contract(contractAddress, contractABI, signer);
            const result = await WithdrawContract['withdraw'](withdraw.withdrawAction, withdraw.sigDigest, withdraw.blockID);
            const receipt = await result.wait();
            return receipt;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    /**
     * Initializes the ERC20 Withdraw process by calling the 'initiateWithdrawal' action in the ERC20Withdraw contract. This will set the withdraw in motion and create a time-lock period for the withdraw to be processed. Will be called using the block data and action data returned from the 'submitWithdraw' function, which was formed from the transaction receipt of 'withdraw' in the 'settle.wns' contract.
     *
     * @param withdraw The formatted withdraw data, composed of wire withdraw transaction block data, to be submitted to the Ethereum contract.
     * @returns The transaction receipt from the Ethereum network.
     */
    async initializeErcWithdraw(withdraw) {
        if (!this.web3Connect.connected)
            throw new Error('No Ethereum account connected.');
        try {
            const chainId = this.web3Connect.chainID;
            if (!wire_wns_interfaces_1.default[chainId])
                throw new Error('CHAIN MISMATCH: Unsupported Chain ID: ' + chainId);
            const signer = this.web3Connect.web3Provider.getSigner();
            let contractAddress = '';
            let contractABI = [];
            switch (withdraw.submittedReceipt.asset_type) {
                case 20:
                    contractAddress = ERC20_WITHDRAW_CONTRACT;
                    contractABI = erc20withdraw_abi_1.default;
                    break;
                case 721:
                    contractAddress = ERC721_WITHDRAW_CONTRACT;
                    contractABI = erc721withdraw_abi_1.default;
                    break;
                case 1155:
                    contractAddress = ERC1155_WITHDRAW_CONTRACT;
                    contractABI = erc1155withdraw_abi_1.default;
                    break;
            }
            const WithdrawContract = new ethers_1.ethers.Contract(contractAddress, contractABI, signer);
            const result = await WithdrawContract['initiateWithdrawal'](withdraw.withdrawAction, withdraw.initWithdrawalBlock);
            const receipt = await result.wait();
            return receipt;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    // -----*** WNS Helpers ***-----
    /**
     * Gets 'account_name's balance from settle.wns contract. Will return all balance rows of the user if no contract_addr is provided, otherwise returns the balance of a specific token.
     *
     * @param contract_addr The contract address of the token to get the balance of. If not provided, will return all balances of the user.
     * @returns The balance row(s) of the 'account_name' in the settle.wns contract. All balance rows of the user if no 'contract_addr' is provided.
     */
    async getSettleBalance(contract_addr) {
        if (contract_addr === '')
            throw new Error('Invalid contract address provided.');
        else if (contract_addr) {
            // Gets the balance row of a specific token based on contract address + account_name hashed. By querying the 'balances' table in 'settle.wns' contract.
            if (contract_addr.includes('0x'))
                contract_addr = contract_addr.slice(2);
            const usr_cont_hash = this.user_contract_hash(this.username, contract_addr);
            console.log('getting settle balance: ', this.username, contract_addr, usr_cont_hash);
            const result = await this.getRows({
                contract: 'settle.wns',
                table: 'balances',
                key_type: 'sha256',
                index_position: 4,
                lower_bound: usr_cont_hash,
                upper_bound: usr_cont_hash,
            }).catch((err) => {
                throw new Error('Error fetching single settle.wns balance: ', err);
            });
            return result.rows;
        }
        else {
            // Gets all balance rows associated with 'account_name'
            const result = await this.getRows({
                contract: 'settle.wns',
                table: 'balances',
                key_type: 'name',
                index_position: 2,
                lower_bound: this.username,
                upper_bound: this.username,
            }).catch((err) => {
                throw new Error('Error fetching all settle.wns balances: ', err);
            });
            return result.rows;
        }
    }
    /**
     * Gets the balance of an ERC20 token for a specific user. Uses the 'get_currency_balance' endpoint of the Hyperion.
     *
     * @param symbol (Optional) The symbol of the token to get the balance of. If no symbol, return all wire token balances.
     * @returns The balance of the the token in the format of ['10.0000 USDC']
     */
    async getWireTokenBalance(symbol) {
        const data = await this.getRows({
            contract: 'eosio.token',
            scope: this.username,
            table: 'accounts',
            upper_bound: symbol,
            lower_bound: symbol,
        }).catch(err => {
            throw new Error('Error fetching balance: ', err);
        });
        if (!data)
            throw new Error('No balance data found.');
        else {
            return data.rows.map(row => row.balance);
            // if (symbol) {
            //     let filtered = data.rows.filter((row) => row.balance.includes(symbol.toUpperCase()));
            //     return filtered.map((row) => row.balance);
            // }
            // else
        }
    }
    /**
     * Wraps WNS assets and gives the user wrapped tokens in return. WNS Balances are tracking in the 'settle.wns' contract, in 'balances' table.
     *
     * @param transfer The 'settle.wns' transfer action parameters.
     * @returns Receipt of token transfer from the Wrapper.
     */
    async wrap(transfer) {
        if (!this.web3Connect.connected)
            throw new Error('No Ethereum account connected.');
        const action = {
            account: 'settle.wns',
            name: 'transfer',
            permission: 'auth.ext',
            data: { assetParams: transfer },
        };
        // Push the wrapped transfer to the Wire network.
        const result = (await this.pushWireTransaction(action).catch(error => {
            throw new Error('Error pushing wrap transfer: ', error);
        }));
        // Wait for the transaction to be processed by the Wire network.
        const processed = await this.waitForProcessedTransaction(result?.transaction_id, result?.processed.block_num).catch(error => {
            throw new Error('Error waiting for processed transaction: ', error);
        });
        console.log('PROCESSED', processed);
        // TODO: Replace API with proper contract call once contract is deployed. Remove axios import when this is complete.
        const wrapResult = await axios_1.default
            .post(`${WNS_API}chain/wrap/${processed.id}`, {
            block_num: result.processed.block_num,
        })
            .catch((err) => {
            throw new Error('Error posting to wrapper: ', err);
        });
        if (!wrapResult)
            throw new Error('Unknown error wrapping tokens.');
        console.log('WRAP RESULT', wrapResult);
        return wrapResult;
    }
    /**
     * Wait for a transaction to be processed by the Wire network. Will retry the RPC call to get the transaction until it is found or the maximum number of attempts is reached.
     *
     * @param transaction_id  The transaction ID to wait for.
     * @param block_num (OPTIONAL) The block number hint the transaction was processed in.
     * @returns The processed transaction data once processed
     */
    async waitForProcessedTransaction(transaction_id, block_num) {
        // Throw error if missing RPC connection to check for transaction
        if (!this.rpc)
            throw new Error('No RPC connection found.');
        const maxAttempts = 10; // Maximum number of retry attempts
        let currentAttempt = 0; // Current retry count
        let retryDelay = 500; // Initial delay in ms between retries
        // Loop until the transaction is found or maxAttempts is reached
        while (currentAttempt <= maxAttempts) {
            // Initial wait
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            const block = await this.rpc.get_block(block_num).catch(error => {
                console.log(`Failed to fetch block on attempt #${currentAttempt}/${maxAttempts}:`, error); // Log errors if the RPC call fails
            });
            if (block && block.transactions.length)
                for (const trx of block.transactions)
                    if (trx.trx.id === transaction_id)
                        return trx.trx;
            // Attempt to retrieve the transaction using the RPC call
            // let transaction = await this.rpc.history_get_transaction(transaction_id, block_num).catch((error) => {
            //     console.log(`Failed to fetch transaction on attempt #${currentAttempt}/${maxAttempts}:`, error); // Log errors if the RPC call fails
            // });
            // // Check if the transaction is valid and has the expected structure
            // if (transaction && transaction.trx.trx) return transaction; // SUCCESS Return the transaction if it is found
            // If not yet, wait for retryDelay milliseconds before the next attempt
            currentAttempt++; // Increment the retry count
            retryDelay *= 1.5; // Double the retry delay for exponential backoff
        }
        // If maxAttempts was exceeded without finding the transaction
        throw new Error('Failed to retrieve transaction after maximum attempts.'); // Throw an error if the transaction was not found
    }
    /**
     * Unwraps WNS assets and gives the user a WNS balance in return. WNS Balances are tracked in the 'settle.wns' contract, in 'balances' table.
     *
     * NOTE: To withdraw back to native chain assets a user must first unwrap their WNS assets ( WNS Balance is required )
     *
     * @param actor The Wire account name that is initiating the unwrap and where the transfer is coming from.
     * @param asset The 'Asset' being unwrapped.
     * @param network_contract The Ethereum contract address of Token being unwrapped.
     * @returns The receipt of the transfer from the Wrapper.
     */
    async unwrap(asset, network_contract) {
        const action = {
            account: 'eosio.token',
            name: 'transfer',
            permission: 'active',
            data: {
                from: this.username,
                to: 'wrapper',
                quantity: asset.toString(),
                memo: network_contract,
            },
        };
        const result = (await this.pushWireTransaction(action).catch(error => {
            throw new Error(error.message);
        }));
        if (!result)
            return;
        const processed = await this.waitForProcessedTransaction(result.transaction_id, result.processed.block_num).catch(error => {
            throw new Error('Error waiting for processed transaction: ', error);
        });
        // TODO: Replace API with proper contract call once contract is deployed. Remove axios import when this is complete.
        const unwrapResult = await axios_1.default
            .post(`${WNS_API}chain/unwrap/${result.transaction_id}`, {
            block_num: result.processed.block_num,
        })
            .catch((err) => {
            throw new Error('Error posting to wrapper: ', err);
        });
        if (!unwrapResult)
            return;
        return unwrapResult;
    }
    /**
     * Helper function to get all initiated transactions for an EOS account.
     *
     * Note: Eth addresses and Wire account names are uniquely linked 1:1.
     *
     * @param account_name Account name of the EOS account that the Ethereum account is linked to.
     * @returns An array of initiated transactions for the EOS account.
     */
    async getAllInitedByName(account_name) {
        const result = await this.getRows({
            contract: 'settle.wns',
            table: 'logs',
            key_type: 'name',
            index_position: 3,
            lower_bound: account_name,
            upper_bound: account_name,
        }).catch((err) => {
            throw new Error('Error fetching initiated transactions: ', err);
        });
        return result.rows;
    }
    /**
     * Helper function to get all initiated transactions for the Eth account connected.
     *
     * Note: Eth addresses and Wire account names are uniquely linked 1:1.
     *
     * @param eth_address Optionally can provide an Ethereum address to get initiated transactions for instead of the connected account.
     * @returns An array of initiated transactions for the EOS account.
     */
    async getAllInitedByAddr(eth_address) {
        let shaAddr;
        if (eth_address) {
            if (eth_address.includes('0x'))
                eth_address = eth_address.slice(2);
            shaAddr = (0, wire_utils_1.address_checksum)(eth_address);
        }
        else {
            if (!this.web3Connect.address)
                throw new Error('No Ethereum account connected.');
            shaAddr = (0, wire_utils_1.address_checksum)(this.web3Connect.address);
        }
        const result = await this.getRows({
            contract: 'settle.wns',
            table: 'logs',
            key_type: 'sha256',
            index_position: 5,
            lower_bound: shaAddr,
            upper_bound: shaAddr,
        }).catch((err) => {
            throw new Error('Error fetching initiated transactions: ', err);
        });
        return result.rows;
    }
    /**
     * Pushes an Ethereum transaction to the Wire network. This is used to sign transactions on behalf of an EOS account.
     *
     * @param args Wire transaction arguments to push to the Wire network. Where the Signature should be generated from the Ethereum wallet and converted to Wire format, as well as the msg_hash.
     * @returns Transaction receipt from the Wire network.
     */
    async pushWireTransaction(args) {
        if (!this.web3Connect.connected)
            throw new Error("No Ethereum wallet found, 'WNS.connect' first.");
        const action = {
            account: args.account,
            name: args.name,
            authorization: [
                {
                    actor: args.actor ? args.actor : this.username,
                    permission: args.permission ? args.permission : 'auth.ext',
                },
            ],
            data: args.data,
        };
        const actionDigest = await this.wireActionToDigest(action).catch(err => {
            throw new Error(err);
        });
        const eth_sig = await this.web3Connect
            .signWeb3Message(actionDigest.digest_str)
            .catch(err => {
            throw new Error(err);
        });
        const wire_sig = (0, wire_utils_1.evmSigToWIRE)(eth_sig);
        const result = await this.pushSignedTransaction(actionDigest.trx, wire_sig).catch(err => {
            throw new Error(err);
        });
        return result;
    }
    /**
     * Gets the users full Wire account object from the Wire API.
     *
     * @param username The Wire account name to get the account object of.
     * @returns Wire account object of the user.
     */
    getSystemAccount(username) {
        return new Promise(async (resolve) => {
            if (this.options.chainOptions.hyperion) {
                const result = await axios_1.default
                    .get(`${this.options.chainOptions.hyperion}v2/state/get_account?account=${username}`)
                    .catch((err) => {
                    resolve(undefined);
                });
                if (result && result.data) {
                    if (username == this.username)
                        this._account = result.data.account;
                    resolve(result.data.account);
                }
                else
                    resolve(undefined);
            }
            else {
                // use v1
                // Note: Uses v1 endpoint vs Hyperion.
                const result = await axios_1.default
                    .post(`${this.endpoint}/v1/chain/get_account`, {
                    account_name: username,
                })
                    .catch((err) => {
                    resolve(undefined);
                });
                if (result && result.data) {
                    if (username == this.username)
                        this._account = result.data;
                    resolve(result.data);
                }
                else {
                    resolve(undefined);
                }
            }
        });
    }
    /**
     * Recovers the public key from an Ethereum signed message.
     *
     * @param message The message that was signed.
     * @param signature The signature of the signed message.
     * @returns The public key that signed the message.
     */
    getPubKey(message, signature) {
        const msg_hash = ethers_1.ethers.utils.hashMessage(message);
        return ethers_1.ethers.utils.recoverPublicKey(msg_hash, signature);
    }
    /**
     * Gets a unique hash of user's wire name and contract address. Can be used to query for a user's balance of a specific token in 'settle.wns'.
     *
     * @param account_name The account name of the holder
     * @param contract_addr The contract address of the token
     * @returns Returns a unique hex string hash of the user's wire name and contract address
     */
    user_contract_hash(account_name, contract_addr) {
        // Convert name to uint64_t representation and get bytes
        const n = BigInt((0, wire_utils_1.nameToUint64)(account_name));
        const buffer = new ArrayBuffer(8); // 8 bytes for a 64-bit number
        const view = new DataView(buffer);
        view.setBigUint64(0, n, true); // true for little-endian
        const nameBytes = new Uint8Array(buffer);
        // Slice off the '0x' prefix if it exists
        if (contract_addr.startsWith('0x'))
            contract_addr = contract_addr.slice(2);
        // Convert the contract address to bytes
        const contBytes = Buffer.from(contract_addr, 'hex');
        // Concatenate nameBytes and contBytes
        const concatenatedBytes = new Uint8Array(nameBytes.length + contBytes.length);
        concatenatedBytes.set(nameBytes);
        concatenatedBytes.set(contBytes, nameBytes.length);
        // Hash the concatenated bytes
        return hash
            .sha256()
            .update(Buffer.from(concatenatedBytes.buffer))
            .digest('hex');
    }
    // -----*** PRIVATE METHODS ***-----
    /**
     * Deposits ERC20 tokens into the WNS Bucket.
     *
     * @param tokenAddress Contract address of the token being transferred
     * @param amount The amount of tokens being transferred
     * @returns Transaction data required to set your WNS deposit transaction to pending, which will then be validated.
     */
    async depositErc20ToBucket(tokenAddress, amount) {
        // Make sure token Address has 0x prefix.
        if (!tokenAddress.startsWith('0x'))
            tokenAddress = '0x' + tokenAddress;
        // const provider = new ethers.providers.Web3Provider(this.ethereum);
        const signer = this.web3Connect.web3Provider.getSigner();
        const erc20Contract = new ethers_1.ethers.Contract(tokenAddress, erc20_abi_1.default, signer);
        const tokenAmount = ethers_1.ethers.utils.parseUnits(amount.toString(), 18);
        // const tx: EthTransaction = await erc20Contract['transfer'](ETH_WNS_BUCKET, tokenAmount).catch((err: any) => { throw new Error("Error submitting ERC20 transfer: ", err) });
        // tx.wait()
        const tx = await erc20Contract['transfer'](ETH_WNS_BUCKET, tokenAmount).catch((err) => {
            throw new Error('Error submitting ERC20 transfer: ', err);
        });
        const receipt = await tx.wait();
        // const receipt = await this.web3Connect.web3Provider.waitForTransaction(tx.hash!).catch((err: any) => { throw new Error("Error waiting for transaction: ", err) });
        const { r, s, v } = tx;
        if (!r || !s || !v)
            throw new Error('Invalid signature r, s, v missing.');
        const recoveryId = (v - 35 - this.web3Connect.chainID * 2) % 2; // Results in 0 or 1
        const newV = recoveryId + 27; // 27 or 28
        const trx = {
            nonce: +ethers_1.ethers.utils.hexlify(tx.nonce),
            gasPrice: tx.gasPrice.toBigInt(),
            gasLimit: tx.gasLimit.toBigInt(),
            to: tx.to,
            value: tx.value.toBigInt(),
            data: tx.data,
            v: tx.v,
            r: tx.r,
            s: tx.s,
            type: BigInt(tx.type),
        };
        const t = tx_1.TransactionFactory.fromTxData(trx);
        const msg_digest = t.getHashedMessageToSign();
        const signature = (0, utils_1.joinSignature)({ r, s, v: newV });
        const sig = (0, wire_utils_1.evmSigToWIRE)(signature, 'K1');
        const result = {
            trx_id: new Uint8Array(Buffer.from(tx.hash.slice(2), 'hex')),
            blockNum: receipt.blockNumber,
            sig,
            msg_digest: Buffer.from(msg_digest).toString('hex'),
        };
        return { setPending: result, receipt };
    }
    /**
     * Deposits an NFT (ERC721 or ERC1155) into the WNS Bucket. Only one Token ID at a time, but amount is available when transferring ERC1155 tokens where you want to transfer multiple of the same Token ID. Chains into set pending.
     *
     * @param contract_type ERC token standard being transferred (721 or 1155)
     * @param token_id The Token ID of the NFT being transferred
     * @param tokenAddress The contract address of the NFT being transferred
     * @param amount The amount of tokens being transferred (default is 1) can leave blank for 721s.
     * @returns Returns a promise of the SetPending requirements.
     */
    async depositNftToBucket(contract_type, token_id, tokenAddress, amount = 1) {
        // Make sure token address has 0x prefix.
        if (!tokenAddress.startsWith('0x'))
            tokenAddress = '0x' + tokenAddress;
        // const provider = new ethers.providers.Web3Provider(this.ethereum);
        const signer = this.web3Connect.web3Provider.getSigner();
        const abi = contract_type == 721
            ? erc721_abi_1.default
            : erc1155_abi_1.default;
        const contract = new ethers_1.ethers.Contract(tokenAddress, abi, signer);
        // console.log(signer, abi, contract);
        const tx = contract_type == 721
            ? await contract['transferFrom'](this.web3Connect.address, ETH_WNS_BUCKET, +token_id).catch((err) => {
                throw new Error("Error submitting ERC721 'transferFrom': ", err);
            })
            : await contract['safeTransferFrom'](this.web3Connect.address, ETH_WNS_BUCKET, +token_id, amount, '0x').catch((err) => {
                throw new Error("Error submitting ERC1155 'TransferSingle': ", err);
            });
        const receipt = await this.web3Connect.web3Provider
            .waitForTransaction(tx.hash)
            .catch((err) => {
            throw new Error('Error waiting for transaction: ', err);
        });
        const { r, s, v } = tx;
        if (!r || !s || !v)
            throw new Error('Invalid signature r, s, v missing.');
        const recoveryId = (v - 35 - this.web3Connect.chainID * 2) % 2; // 0 or 1
        const newV = recoveryId + 27; // 27 or 28
        const trx = {
            nonce: +ethers_1.ethers.utils.hexlify(tx.nonce),
            gasPrice: tx.gasPrice.toBigInt(),
            gasLimit: tx.gasLimit.toBigInt(),
            to: tx.to,
            value: tx.value.toBigInt(),
            data: tx.data,
            v: tx.v,
            r: tx.r,
            s: tx.s,
            type: BigInt(tx.type),
        };
        const t = tx_1.TransactionFactory.fromTxData(trx);
        const msg_digest = t.getHashedMessageToSign();
        const signature = (0, utils_1.joinSignature)({ r, s, v: newV });
        const sig = (0, wire_utils_1.evmSigToWIRE)(signature, 'K1');
        const result = {
            trx_id: new Uint8Array(Buffer.from(tx.hash.slice(2), 'hex')),
            blockNum: receipt.blockNumber,
            sig,
            msg_digest: Buffer.from(msg_digest).toString('hex'),
        };
        return { setPending: result, receipt };
    }
    /**
     * Used in 'initializeWithdraw', submits the withdraw action to the 'settle.wns' contract. Using the receipt from the withdraw action the data is formatted and returned to be used in the 'submitEthWithdraw' function.
     *
     * @param options Withdraw options required to submit the withdraw action.
     * @returns Formatted data required to submit the withdraw action to the Ethereum network.
     */
    async submitSettleWithdraw(options) {
        if (options.address.startsWith('0x'))
            options.address = options.address.slice(2);
        const to = this.web3Connect.address.includes('0x')
            ? this.web3Connect.address.slice(2)
            : this.web3Connect.address;
        // Form the Wire 'settle.wns' withdraw action based on asset type.
        let action;
        switch (options.asset_type) {
            case 20: {
                const withdraw_data = options.withdraw_data;
                // 'settle.wns' withdraw1 action data for ERC20 withdraws.
                action = {
                    account: 'settle.wns',
                    name: 'withdraw1',
                    permission: 'auth.ext',
                    data: {
                        contractAddress: options.address,
                        amountWhole: withdraw_data.amountWhole,
                        amountDecimal: withdraw_data.amountDecimal,
                        precision: withdraw_data.precision,
                        from: this.username,
                        to,
                    },
                };
                break;
            }
            case 721: {
                // throw new Error("ERC721 Withdraw not implemented yet.");
                const withdraw_data = options.withdraw_data;
                // 'settle.wns' withdraw2 action data for ERC721 withdraws.
                action = {
                    account: 'settle.wns',
                    name: 'withdraw2',
                    permission: 'auth.ext',
                    data: {
                        contractAddress: options.address,
                        tokenId: withdraw_data.tokenId,
                        from: this.username,
                        to,
                    },
                };
                break;
            }
            case 1155: {
                const withdraw_data = options.withdraw_data;
                // 'settle.wns' withdraw3 action data for ERC1155 withdraws.
                action = {
                    account: 'settle.wns',
                    name: 'withdraw3',
                    permission: 'auth.ext',
                    data: {
                        contractAddress: options.address,
                        tokenId: withdraw_data.tokenId,
                        amount: withdraw_data.amount,
                        from: this.username,
                        to,
                    },
                };
                break;
            }
            default:
                throw new Error("Unsupported Asset Type provided in 'submitWithdraw'.");
        }
        return await this.pushWireTransaction(action).catch(error => {
            throw new Error(error);
        });
    }
    async formatSubmittedWithdraw(submittedReceipt) {
        // console.log("WIRE TRANSACTION PUSHED", result);
        const { tx, i } = submittedReceipt.block.transactions
            .map((tx, i) => ({ tx, i }))
            .find(t => t.tx.trx.id === submittedReceipt.trx_id);
        const trx_action = tx.trx.transaction.actions[0];
        let withdrawAction;
        switch (submittedReceipt.asset_type) {
            case 20:
                withdrawAction = {
                    account: trx_action.account,
                    name: trx_action.name,
                    authorization: trx_action.authorization,
                    data: {
                        contractAddress: '0x' + trx_action.data.contractAddress,
                        amountWhole: trx_action.data.amountWhole,
                        amountDecimal: trx_action.data.amountDecimal,
                        precision: trx_action.data.precision,
                        to: '0x' + trx_action.data.to,
                        from: trx_action.data.from,
                    },
                };
                break;
            case 721:
                withdrawAction = {
                    account: trx_action.account,
                    name: trx_action.name,
                    authorization: trx_action.authorization,
                    data: {
                        contractAddress: '0x' + trx_action.data.contractAddress,
                        tokenId: trx_action.data.tokenId,
                        to: '0x' + trx_action.data.to,
                        from: trx_action.data.from,
                    },
                };
                break;
            case 1155:
                withdrawAction = {
                    account: trx_action.account,
                    name: trx_action.name,
                    authorization: trx_action.authorization,
                    data: {
                        contractAddress: '0x' + trx_action.data.contractAddress,
                        tokenId: trx_action.data.tokenId,
                        amount: trx_action.data.amount,
                        to: '0x' + trx_action.data.to,
                        from: trx_action.data.from,
                    },
                };
                break;
        }
        const vrs = Buffer.from(ethers_1.ethers.utils.base58
            .decode(submittedReceipt.block?.producer_signature.slice(7))
            .slice(0, -4)).toString('hex');
        const producer = await this.rpc
            .get_account(submittedReceipt.block.producer)
            .catch(err => {
            throw new Error('Error fetching producer account: ', err);
        });
        const key = producer
            .permissions.find((perm) => perm.perm_name === 'active')
            .required_auth.keys.pop();
        const pointSigValues = {
            signer: (0, wire_utils_1.getEthAddressFromEosPubKey)(key.key),
            v: parseInt(vrs.slice(0, 2), 16) - 4,
            r: '0x' + vrs.slice(2, 66),
            s: '0x' + vrs.slice(66),
        };
        const wTxData = {
            tx_sigs: tx.trx.signatures.map((sig) => '0x' +
                Buffer.from(ethers_1.ethers.utils.base58.decode(tx.trx.signatures[0].slice(7))).toString('hex')),
            packed_context_free_data: [],
            compression: 0,
            packed_tx: '0x' + tx.trx.packed_trx,
            status: 0,
            cpu: tx.cpu_usage_us,
            net: tx.net_usage_words,
        };
        const leaf = '0x' +
            new wire_block_merkle_interface_1.BlockMerkle()._calc({
                tx_sigs: tx.trx.signatures,
                packed_context_free_data: [],
                compression: wire_block_merkle_interface_1.Compression.none,
                packed_tx: tx.trx.packed_trx,
                status: wire_block_merkle_interface_1.Status.executed,
                cpu: tx.cpu_usage_us,
                net: tx.net_usage_words,
            });
        const initWithdrawalBlock = {
            header: {
                header: {
                    _timestamp: (0, eosjs_serialize_1.dateToBlockTimestamp)(submittedReceipt.block.timestamp),
                    _producer: submittedReceipt.block.producer,
                    _confirmed: submittedReceipt.block.confirmed,
                    _previous: '0x' + submittedReceipt.block.previous,
                    _txMroot: '0x' + submittedReceipt.block.transaction_mroot,
                    _actMroot: '0x' + submittedReceipt.block.action_mroot,
                    _scheduleVersion: submittedReceipt.block.schedule_version,
                },
                _blockMroot: '0x' +
                    submittedReceipt.state.blockroot_merkle._active_nodes.pop(),
                _scheduleHash: '0x' +
                    submittedReceipt.state.pending_schedule.schedule_hash,
            },
            pointSigValues: pointSigValues,
            txLeafNodes: [leaf],
            wTxData,
            wIndex: i, // withdrawal index of all the txs in the block (order matters)
        };
        return {
            initWithdrawalBlock,
            withdrawAction,
            submittedReceipt,
        };
    }
}
exports.WNS = WNS;
exports.default = WNS;
//# sourceMappingURL=wire-wns.js.map