/**
 * @module WireUtils
 * copyright defined in eosjs/LICENSE.txt
 */
/// <reference types="node" />
import { KeyType } from './eosjs-numeric';
import { Key } from './wire-chain-service-interfaces';
/** Generates a key pair based on a username and password.
 *  @param username The username to use as a salt.
 *  @param password The password to hash.
 *  @returns Key The generated key pair.
 */
export declare const generateKey: (username: string, password: string) => Key;
/**
 * Get the public key in compressed format from a public or private key.
 *
 * @param key Either a public or private key
 * @param isPrivate Boolean indicating if the key is private, defaults to false.
 * @returns The public key in compressed format.
 */
export declare const getCompressedPublicKey: (key: string, isPrivate?: boolean) => string;
/**
 * Get the Ethereum address from a public or private key.
 *
 * @param key Either a public or private key
 * @param isPrivate Boolean indicating if the key is private,defaults to false.
 * @returns The Ethereum address derived from the key.
 */
export declare const getEthAddressFromEosPubKey: (eosPubKey: string) => string;
/**
 * Convert an Ethereum signature to WIRE format, either K1 or EM based on prefix.
 *
 * @param eth_sig A signature in the format of an Ethereum signature.
 * @param prefix WIRE prefix to use for the signature. K1 or EM, EM by default.
 * @returns A WIRE formatted signature.
 */
export declare const evmSigToWIRE: (eth_sig: string, prefix?: 'K1' | 'EM') => string;
/**
 * Given a hex string of an address, returns a valid wire name. Takes the first and last 4 bytes ( 8 characters from each end ) and converts them to a base32 string.
 *
 * Note: This implementation has a nearly impossible chance of collisions. Reference: https://vanity-eth.tk/
 *
 * @param address Hex formatted string of an address. '0x' prefix is optional, will be pruned.
 * @returns A valid Wire name generated from the address.
 */
export declare const addressToWireName: (address: string) => string;
/**
 * Converts a price from string format to a number, taking into account the token precision.
 *
 * @param price The price as a string.
 * @param precision The precision of the token.
 * @returns The price as a number.
 */
export declare const priceToPrecision: (price: string, precision: string | number) => number;
/**
 * Converts an ETH address to a checksum that can be used as the sha256 index for a contract table.
 *
 * @param address Eth Address
 * @returns Shae256 checksum of the address
 */
export declare const address_checksum: (address: string) => string;
/**
 * Given two usernames generates a unique string that is the same regardless of the order of the usernames. Leverages the structure of Wire account names being uints.
 *
 * @param a Username A
 * @param b Username B
 * @returns A unique string representing the pair of the two usernames.
 */
export declare const cantor: (a: string, b: string) => string;
/**
 * Given a WIRE name, returns the uint64 representation of the name.
 *
 * @param name A Wire name username.
 * @returns The uint64 representation of the name as a bigint to string.
 */
export declare const nameToUint64: (name: string) => string;
/**
 * Convert from given Uint64 to a Wire's name format.
 *
 * @param value A string represents uint64
 * @returns The Wire name that the passed in uint64 represents.
 */
export declare const uint64ToName: (value: string) => string;
/**
 * Convert an Ethereum public key to a WIRE public key. Can convert to any Wire supported key type i.e. K1, EM, R1, etc.
 *
 * @param ethPubKey An Ethereum public key.
 * @param keyType The key type to convert to, defaults to EM.
 * @returns A WIRE formatted public key.
 */
export declare const ethPubKeyToWirePubKey: (ethPubKey: string, keyType?: KeyType) => string;
/**
 * Converts Buffer containing an Ethereum address (link that stored in auth.msg links table)
 * Adds Ox and resturns as readable hex string
 * 20 bytes expected
 *
 * @param address 20 bytes buffer of eth address
 * @returns readable hex string of eth address with 0x prefix
 */
export declare const ethAddressBufferToString: (address: Buffer) => string;
