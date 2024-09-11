import { ChainService } from './wire-chain-service';
import { ContractReceipt } from 'ethers';
import { AuthMsgLink, WireTransactionArgs, SetPending, SettleLog, Transfer, WNSDepositInfo, WNSWithdrawInfo, WnsOptions, WnsPendingDepositInfo, SupportedAssetType, SettleBalance, ApiWrapResult, WireSwapParams, WNSTransferParams, InitWithdraw, SubmittedEthWithdraw, SubmittedWithdrawReceipt, WireSystemAccount } from './wire-wns-interfaces';
import { UpapAsset } from './wire-asset-interface';
import { TransactResult } from './eosjs-api-interfaces';
import { GetBlockHeaderStateResult, GetBlockResult, PackedTransaction } from './eosjs-rpc-interfaces';
import { Web3Connect } from './wire-connect';
/**
 * Represents the WNS (Wire Name Service) class, which is responsible for connecting to an Ethereum wallet,
 * managing the connection, and performing various actions related to the Wire blockchain via your Ethereum wallet prompts.
 *
 * NOTE: This class extends the ChainService class, which provides the base functionality for connecting to the Wire blockchain. Can initialize just ChainService if you don't need WNS functionality.
 *
 * @params wnsOptions Options required to initialize the WNS class. Includes the endpoints array for the Wire blockchain, and the options required to connect to an Ethereum wallet.
 */
export declare class WNS extends ChainService {
    private _eth_pub_key?;
    private _username?;
    private _account?;
    web3Connect: Web3Connect;
    link?: AuthMsgLink | void;
    options: WnsOptions;
    get username(): string | undefined;
    get wireAccount(): WireSystemAccount;
    get pubKey(): string;
    get endpoint(): string;
    constructor(wnsOptions: WnsOptions);
    /**
     * Calls web3 connect, then initializes the username, link, and system account
     *
     * @returns address of connected account from web3 connection
     */
    connect(): Promise<string>;
    /**
     * Initializes the username, link, and system account
     *
     * @param address
     */
    initializeUserData(address: string): Promise<void>;
    /**
     * Disconnects the Web3 connection and resets the _eth_pub_key, _username, link, and _account
     */
    disconnectWNS(): void;
    /**
     * Hits WNS API and register a new user account
     * @param wirePubKeyEM
     * @param ethAddress
     * @returns
     */
    register(wirePubKeyEM: string, ethAddress: string): Promise<import("axios").AxiosResponse<any, any>>;
    retrievePubKey(): Promise<string>;
    /**
     * Check Link By Address
     * Checks the 'auth.msg' contract's 'links' table by address to see if the provided Ethereum address is linked to an EOS account.
     * Will use the connected wallet's address if no address is provided.
     *
     * @param address Optional Ethereum address to check the link status of, if not provided will use the connected wallet's address.
     * @returns The link status of the provided Ethereum address as seen in the 'auth.msg' contract's 'links' table.
     */
    checkLink(address?: string): Promise<AuthMsgLink>;
    /**
     * Checks the 'auth.msg' contract's 'links' table by username to see if the provided EOS account is linked to an Ethereum address.
     * Will use the connected wallet's username if no username is provided.
     *
     * @param username Username to check the link status of, if not provided will use the connected wallet's username.
     * @returns The link status of the provided EOS account as seen in the 'auth.msg' contract's 'links' table.
     */
    checkLinkByUsername(username?: string): Promise<AuthMsgLink>;
    /**
     * Creates a link between the Ethereum account used to sign these transactions and the EOS account provided.
     * Once linked, the Ethereum account can sign transactions on behalf of the EOS account and will be granted the special 'auth.ext' permission.
     *
     * @param account_name EOS account name to link with Ethereum account.
     * @param pub_key Optional public key to use for linking. If not provided, will attempt to retrieve from Ethereum wallet.
     * @returns Returns the transaction receipts for the 'createlink' and 'linkauth' actions.
     */
    createLink(username: string): Promise<TransactResult>;
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
    linkAuthExt(username: string): Promise<TransactResult>;
    /**
     * Step 1 of deposit flow of assets into the WNS Ecosystem. Initializes the deposit process by declaring intent to deposit assets, initializing a row in the 'settle.wns' contract's logs table.
     *
     * Note: This is the first step in the deposit process and can be cancelled if the transaction is not set to 'pending' in the Wire logs table. Users may only have a set number of initiated transactions at a time.
     *
     * @param token_addr Contract address of the token being deposited.
     * @param asset_type The type of asset being deposited (20, 721, 1155).
     * @returns Returns the transaction receipt from the Wire network.
     */
    depositInitiate(token_addr: string, asset_type: SupportedAssetType): Promise<TransactResult>;
    /**
     * Step 2 of deposit flow. Transfers assets from the user's Ethereum wallet to the WNS Bucket.
     *
     * NOTE: IMPORTANT! This step is irreversible and will transfer assets to the WNS Bucket. Make sure 'setPending' data which is returned is SAVED, for use in Step 3: Set Pending, to kick off deposit validation.
     *
     * @param deposit_info Information required to deposit assets into the WNS Bucket.
     * @returns Returns the SetPending data required to set the transaction to 'pending' in the Wire logs table (kicking off deposit validation) and the Ethereum Transaction Receipt.
     */
    depositToEthBucket(deposit_info: WNSDepositInfo): Promise<WnsPendingDepositInfo>;
    /**
     * Step 3 of deposit flow. Sets the transaction to 'pending' in the Wire logs table. This is the final step in the deposit process and starts the deposit validation process.
     *
     * Note: Will need to provide the primary key of the appropriate 'logs' table row, in the 'settle.wns' contract. This can be fetched from the 'logs' table in the 'settle.wns' contract use 'getAllInitedByName' or 'getAllInitedByAddr'.
     *
     * @param key The primary key of the initiated transaction in the 'logs' table.
     * @param pending_data Data required to set the transaction to 'pending' in the Wire logs table. Got from Step 2: Deposit to Eth Bucket.
     * @returns Returns the transaction receipt from the Wire network.
     */
    depositSetPending(key: number, pending_data: SetPending): Promise<TransactResult>;
    /**
     * Cancels an initiated deposit by key. Will cancel the deposit if the transaction is still in the 'initiated' state (0) in Settle WNS.
     *
     * @param logKey The primary key of the initiated transaction in the 'logs' table.
     * @returns Returns the transaction receipt for the 'canceltrx' action.
     */
    cancelInitiatedDeposit(logKey: number): Promise<TransactResult>;
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
    wnsTransfer(transfer_info: WNSTransferParams): Promise<TransactResult>;
    /**
     * Swap assets between two different tokens on the Wire blockchain. Calls WNSTransfer to perform the swap.
     *
     * @param opts Options required to perform the swap between two tokens.
     * @returns transaction receipt from the Wire network for the transfer
     * @throws Throws an error if the swap transfer fails.
     */
    swap(opts: WireSwapParams): Promise<TransactResult>;
    /**
     * Step 1 of Withdraw flow. Kicks off the withdraw process by calling withdraw action in the 'settle.wns' contract. With the resulting block data, the user can then call the 'submitEthWithdraw' as step 2.
     *
     * NOTE: Withdraw will pull from 'settle.wns' balance first, then if not enough, will unwrap the required amount from the Ethereum wallet ( In the case of ERC20s ).
     *
     * @params withdraw_info Information required to withdraw assets from the WNS Ecosystem.
     * @returns Formatted withdraw data, composed of wire withdraw transaction block data, to be submitted to the Ethereum contract.
     */
    initializeWithdraw(withdraw_info: WNSWithdrawInfo<SupportedAssetType>): Promise<SubmittedWithdrawReceipt>;
    getPendingBlockState(block_num: number): Promise<{
        state: GetBlockHeaderStateResult;
        block: GetBlockResult;
    }>;
    /**
     * Step 2 of Withdraw flow. Submits the formatted withdraw action to the WNS Ethereum Contract, where a time-lock (challenge window) will be set for the withdraw to be processed. Time-lock period is to allow for validation of the withdraw on the EOS side, essentially a window to challenge the truth of the proposed transaction.
     *
     * Note: Time-lock period is set in the Ethereum contract. Once the time-lock period is over, 'finalize' must be called.
     *
     * @param withdraw Formatted withdraw data, composed of wire withdraw transaction block data, to be submitted to the Ethereum contract.
     * @returns Initial Withdraw data, along with some additional data from the Ethereum transaction.
     */
    submitEthWithdraw(withdraw: InitWithdraw): Promise<SubmittedEthWithdraw>;
    /**
     * Step 3 of Withdraw flow. Finalizes the withdraw process by calling the 'withdraw' action on the ERC20Withdraw contract. This can be called once the time-lock period is over from step 2.
     *
     * @param key Block ID and Signature Digest returned from step 2 'submitEthWithdraw'.
     * @param withdrawAction The withdraw action formatted and returned from step 1 also returned in step 2.
     * @returns The transaction receipt from the Ethereum network.
     */
    finalizeWithdraw(withdraw: SubmittedEthWithdraw): Promise<ContractReceipt>;
    /**
     * Initializes the ERC20 Withdraw process by calling the 'initiateWithdrawal' action in the ERC20Withdraw contract. This will set the withdraw in motion and create a time-lock period for the withdraw to be processed. Will be called using the block data and action data returned from the 'submitWithdraw' function, which was formed from the transaction receipt of 'withdraw' in the 'settle.wns' contract.
     *
     * @param withdraw The formatted withdraw data, composed of wire withdraw transaction block data, to be submitted to the Ethereum contract.
     * @returns The transaction receipt from the Ethereum network.
     */
    private initializeErcWithdraw;
    /**
     * Gets 'account_name's balance from settle.wns contract. Will return all balance rows of the user if no contract_addr is provided, otherwise returns the balance of a specific token.
     *
     * @param contract_addr The contract address of the token to get the balance of. If not provided, will return all balances of the user.
     * @returns The balance row(s) of the 'account_name' in the settle.wns contract. All balance rows of the user if no 'contract_addr' is provided.
     */
    getSettleBalance(contract_addr?: string): Promise<SettleBalance<SupportedAssetType>[]>;
    /**
     * Gets the balance of an ERC20 token for a specific user. Uses the 'get_currency_balance' endpoint of the Hyperion.
     *
     * @param symbol (Optional) The symbol of the token to get the balance of. If no symbol, return all wire token balances.
     * @returns The balance of the the token in the format of ['10.0000 USDC']
     */
    getWireTokenBalance(symbol?: string): Promise<string[]>;
    /**
     * Wraps WNS assets and gives the user wrapped tokens in return. WNS Balances are tracking in the 'settle.wns' contract, in 'balances' table.
     *
     * @param transfer The 'settle.wns' transfer action parameters.
     * @returns Receipt of token transfer from the Wrapper.
     */
    wrap(transfer: Transfer): Promise<ApiWrapResult>;
    /**
     * Wait for a transaction to be processed by the Wire network. Will retry the RPC call to get the transaction until it is found or the maximum number of attempts is reached.
     *
     * @param transaction_id  The transaction ID to wait for.
     * @param block_num (OPTIONAL) The block number hint the transaction was processed in.
     * @returns The processed transaction data once processed
     */
    waitForProcessedTransaction(transaction_id: string, block_num?: number): Promise<PackedTransaction>;
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
    unwrap(asset: UpapAsset, network_contract: string): Promise<import("axios").AxiosResponse<any, any>>;
    /**
     * Helper function to get all initiated transactions for an EOS account.
     *
     * Note: Eth addresses and Wire account names are uniquely linked 1:1.
     *
     * @param account_name Account name of the EOS account that the Ethereum account is linked to.
     * @returns An array of initiated transactions for the EOS account.
     */
    getAllInitedByName(account_name: string): Promise<SettleLog[]>;
    /**
     * Helper function to get all initiated transactions for the Eth account connected.
     *
     * Note: Eth addresses and Wire account names are uniquely linked 1:1.
     *
     * @param eth_address Optionally can provide an Ethereum address to get initiated transactions for instead of the connected account.
     * @returns An array of initiated transactions for the EOS account.
     */
    getAllInitedByAddr(eth_address?: string): Promise<SettleLog[]>;
    /**
     * Pushes an Ethereum transaction to the Wire network. This is used to sign transactions on behalf of an EOS account.
     *
     * @param args Wire transaction arguments to push to the Wire network. Where the Signature should be generated from the Ethereum wallet and converted to Wire format, as well as the msg_hash.
     * @returns Transaction receipt from the Wire network.
     */
    pushWireTransaction(args: WireTransactionArgs): Promise<TransactResult>;
    /**
     * Gets the users full Wire account object from the Wire API.
     *
     * @param username The Wire account name to get the account object of.
     * @returns Wire account object of the user.
     */
    getSystemAccount(username: string): Promise<WireSystemAccount | undefined>;
    /**
     * Recovers the public key from an Ethereum signed message.
     *
     * @param message The message that was signed.
     * @param signature The signature of the signed message.
     * @returns The public key that signed the message.
     */
    getPubKey(message: string, signature: string): string;
    /**
     * Gets a unique hash of user's wire name and contract address. Can be used to query for a user's balance of a specific token in 'settle.wns'.
     *
     * @param account_name The account name of the holder
     * @param contract_addr The contract address of the token
     * @returns Returns a unique hex string hash of the user's wire name and contract address
     */
    user_contract_hash(account_name: string, contract_addr: string): string;
    /**
     * Deposits ERC20 tokens into the WNS Bucket.
     *
     * @param tokenAddress Contract address of the token being transferred
     * @param amount The amount of tokens being transferred
     * @returns Transaction data required to set your WNS deposit transaction to pending, which will then be validated.
     */
    private depositErc20ToBucket;
    /**
     * Deposits an NFT (ERC721 or ERC1155) into the WNS Bucket. Only one Token ID at a time, but amount is available when transferring ERC1155 tokens where you want to transfer multiple of the same Token ID. Chains into set pending.
     *
     * @param contract_type ERC token standard being transferred (721 or 1155)
     * @param token_id The Token ID of the NFT being transferred
     * @param tokenAddress The contract address of the NFT being transferred
     * @param amount The amount of tokens being transferred (default is 1) can leave blank for 721s.
     * @returns Returns a promise of the SetPending requirements.
     */
    private depositNftToBucket;
    /**
     * Used in 'initializeWithdraw', submits the withdraw action to the 'settle.wns' contract. Using the receipt from the withdraw action the data is formatted and returned to be used in the 'submitEthWithdraw' function.
     *
     * @param options Withdraw options required to submit the withdraw action.
     * @returns Formatted data required to submit the withdraw action to the Ethereum network.
     */
    private submitSettleWithdraw;
    formatSubmittedWithdraw(submittedReceipt: SubmittedWithdrawReceipt): Promise<InitWithdraw>;
}
export default WNS;
