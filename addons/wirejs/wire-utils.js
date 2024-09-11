"use strict";
/**
 * @module WireUtils
 * copyright defined in eosjs/LICENSE.txt
 */
// (window as any).global = window;
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
exports.ethAddressBufferToString = exports.ethPubKeyToWirePubKey = exports.uint64ToName = exports.nameToUint64 = exports.cantor = exports.address_checksum = exports.priceToPrecision = exports.addressToWireName = exports.evmSigToWIRE = exports.getEthAddressFromEosPubKey = exports.getCompressedPublicKey = exports.generateKey = void 0;
const eosjs_numeric_1 = require("./eosjs-numeric");
const ethers_1 = require("ethers");
const elliptic_1 = require("elliptic");
const utils_1 = require("ethers/lib/utils");
const PublicKey_1 = require("./PublicKey");
const pbkdf2 = __importStar(require("pbkdf2"));
const ec = new elliptic_1.ec('secp256k1');
// import * as ecc from 'eosjs-ecc';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ecc = require('eosjs-ecc');
// import { ecc } from './eosjs-ecc';
// "\x19Ethereum Signed Message\n32" in hex
const ETH_PREFIX_HEX = '19457468657265756d205369676e6564204d6573736167653a0a3332';
/** Generates a key pair based on a username and password.
 *  @param username The username to use as a salt.
 *  @param password The password to hash.
 *  @returns Key The generated key pair.
 */
const generateKey = (username, password) => {
    const seed = pbkdf2
        .pbkdf2Sync(password, username, 1, 32, 'sha512')
        .toString('hex');
    const key = {
        priv_key: ecc.seedPrivate(seed),
        pub_key: ecc.privateToPublic(ecc.seedPrivate(seed)),
    };
    return key;
};
exports.generateKey = generateKey;
/**
 * Get the public key in compressed format from a public or private key.
 *
 * @param key Either a public or private key
 * @param isPrivate Boolean indicating if the key is private, defaults to false.
 * @returns The public key in compressed format.
 */
const getCompressedPublicKey = (key, isPrivate = false) => {
    if (key.startsWith('0x'))
        key = key.slice(2);
    const keyPair = isPrivate
        ? ec.keyFromPrivate(key)
        : ec.keyFromPublic(key, 'hex');
    return keyPair.getPublic(true, 'hex');
};
exports.getCompressedPublicKey = getCompressedPublicKey;
/**
 * Get the Ethereum address from a public or private key.
 *
 * @param key Either a public or private key
 * @param isPrivate Boolean indicating if the key is private,defaults to false.
 * @returns The Ethereum address derived from the key.
 */
const getEthAddressFromEosPubKey = (eosPubKey) => {
    if (eosPubKey.startsWith('EOS'))
        eosPubKey = eosPubKey.slice(3);
    const decoded = ethers_1.ethers.utils.base58.decode(eosPubKey);
    const compressedEllipticPubKey = Buffer.from(decoded)
        .toString('hex')
        .slice(0, -8); // Remove checksum
    const keyPair = ec.keyFromPublic(compressedEllipticPubKey, 'hex');
    const pub = keyPair.getPublic();
    const uncompressedPubKey = pub.encode('hex', false).slice(2);
    const pubKeyHash = ethers_1.ethers.utils.keccak256(Buffer.from(uncompressedPubKey, 'hex'));
    return '0x' + pubKeyHash.slice(-40); // Last 20 bytes as Ethereum address
    // return ''
};
exports.getEthAddressFromEosPubKey = getEthAddressFromEosPubKey;
/**
 * Convert an Ethereum signature to WIRE format, either K1 or EM based on prefix.
 *
 * @param eth_sig A signature in the format of an Ethereum signature.
 * @param prefix WIRE prefix to use for the signature. K1 or EM, EM by default.
 * @returns A WIRE formatted signature.
 */
const evmSigToWIRE = (eth_sig, prefix = 'EM') => {
    if ((!eth_sig.startsWith('0x') && eth_sig.length !== 130) ||
        (eth_sig.startsWith('0x') && eth_sig.length !== 132))
        throw new Error('Incorrect length or signature type');
    eth_sig = eth_sig.startsWith('0x') ? eth_sig.slice(2) : eth_sig;
    // add 4 to recovery
    const r = eth_sig.slice(0, 64);
    const s = eth_sig.slice(64, 128);
    let v = eth_sig.slice(128);
    v = (parseInt(v, 16) + 4).toString(16);
    // we have to go from rsv to vrs
    const sig_before_checksum = v + r + s;
    // we have to get the digest suffix ripemd160 hash
    const checksum = Buffer.from((0, eosjs_numeric_1.digestSuffixRipemd160)(Buffer.from(sig_before_checksum, 'hex'), prefix).slice(0, 4)).toString('hex');
    const sig_before_encoding = sig_before_checksum + checksum;
    return ('SIG_' +
        prefix +
        '_' +
        ethers_1.ethers.utils.base58.encode(Buffer.from(sig_before_encoding, 'hex')));
};
exports.evmSigToWIRE = evmSigToWIRE;
function char_to_symbol(c) {
    if (typeof c == 'string')
        c = c.charCodeAt(0);
    if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
        return c - 'a'.charCodeAt(0) + 6;
    }
    if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
        return c - '1'.charCodeAt(0) + 1;
    }
    return 0;
}
/**
 * Given a hex string of an address, returns a valid wire name. Takes the first and last 4 bytes ( 8 characters from each end ) and converts them to a base32 string.
 *
 * Note: This implementation has a nearly impossible chance of collisions. Reference: https://vanity-eth.tk/
 *
 * @param address Hex formatted string of an address. '0x' prefix is optional, will be pruned.
 * @returns A valid Wire name generated from the address.
 */
const addressToWireName = (address) => {
    if (![40, 42].includes(address?.length))
        throw new Error('not valid address length');
    let addr = address.includes('0x') ? address.slice(2) : address;
    if (addr[40] !== '0')
        addr = addr.slice(0, -1) + '0';
    const int = BigInt('0x' + addr.slice(0, 8) + addr.slice(-8));
    const charMap = '.12345abcdefghijklmnopqrstuvwxyz';
    const str = [];
    let tmp = BigInt.asUintN(64, int);
    for (let i = 0; i <= 12; ++i) {
        const bigiAnd = BigInt(i === 0 ? 0x0f : 0x1f);
        const idx = tmp & bigiAnd;
        str[12 - i] = charMap[Number(idx.toString())];
        const bigi = BigInt(i === 0 ? 4 : 5);
        tmp = tmp >> bigi;
    }
    return str.join('').replace(/\.+$/g, '');
};
exports.addressToWireName = addressToWireName;
/**
 * Converts a price from string format to a number, taking into account the token precision.
 *
 * @param price The price as a string.
 * @param precision The precision of the token.
 * @returns The price as a number.
 */
const priceToPrecision = (price, precision) => {
    return +price / Math.pow(10, +precision);
};
exports.priceToPrecision = priceToPrecision;
/**
 * Converts an ETH address to a checksum that can be used as the sha256 index for a contract table.
 *
 * @param address Eth Address
 * @returns Shae256 checksum of the address
 */
const address_checksum = (address) => {
    if (address.startsWith('0x'))
        address = address.slice(2);
    const buffer = Buffer.from(address, 'hex');
    return Buffer.from((0, utils_1.sha256)(buffer)).toString('hex');
};
exports.address_checksum = address_checksum;
/**
 * Given two usernames generates a unique string that is the same regardless of the order of the usernames. Leverages the structure of Wire account names being uints.
 *
 * @param a Username A
 * @param b Username B
 * @returns A unique string representing the pair of the two usernames.
 */
const cantor = (a, b) => {
    const aNum = BigInt((0, exports.nameToUint64)(a));
    const bNum = BigInt((0, exports.nameToUint64)(b));
    // console.log("A:", aNum);
    // console.log("B:", bNum);
    let numA = aNum;
    let numB = bNum;
    if (aNum > bNum) {
        numB = aNum;
        numA = bNum;
    }
    const cont = ((numA + numB) * (numA + numB + BigInt(1))) / BigInt(2) + numA;
    return (0, exports.uint64ToName)(cont.toString());
};
exports.cantor = cantor;
/**
 * Given a WIRE name, returns the uint64 representation of the name.
 *
 * @param name A Wire name username.
 * @returns The uint64 representation of the name as a bigint to string.
 */
const nameToUint64 = (name) => {
    let n = BigInt(0);
    let i = 0;
    for (; i < 12 && name[i]; i++) {
        n |=
            BigInt(char_to_symbol(name.charCodeAt(i)) & 0x1f) <<
                BigInt(64 - 5 * (i + 1));
    }
    if (i == 12) {
        n |= BigInt(char_to_symbol(name.charCodeAt(i)) & 0x0f);
    }
    return n.toString();
};
exports.nameToUint64 = nameToUint64;
/**
 * Convert from given Uint64 to a Wire's name format.
 *
 * @param value A string represents uint64
 * @returns The Wire name that the passed in uint64 represents.
 */
const uint64ToName = (value) => {
    const charMap = '.12345abcdefghijklmnopqrstuvwxyz';
    const str = [];
    let tmp = BigInt.asUintN(64, BigInt(value));
    for (let i = 0; i <= 12; ++i) {
        const idx = tmp & BigInt(i === 0 ? 0x0f : 0x1f);
        str[12 - i] = charMap[Number(idx.toString())];
        tmp = tmp >> BigInt(i === 0 ? 4 : 5);
    }
    return str.join('').replace(/\.+$/g, '');
};
exports.uint64ToName = uint64ToName;
/**
 * Convert an Ethereum public key to a WIRE public key. Can convert to any Wire supported key type i.e. K1, EM, R1, etc.
 *
 * @param ethPubKey An Ethereum public key.
 * @param keyType The key type to convert to, defaults to EM.
 * @returns A WIRE formatted public key.
 */
const ethPubKeyToWirePubKey = (ethPubKey, keyType = eosjs_numeric_1.KeyType.em) => {
    if (ethPubKey.startsWith('0x'))
        ethPubKey = ethPubKey.slice(2);
    const keypair = ec.keyFromPublic(ethPubKey, 'hex');
    const pub_key_pair = PublicKey_1.PublicKey.fromElliptic(keypair, keyType, ec);
    return pub_key_pair.toString();
};
exports.ethPubKeyToWirePubKey = ethPubKeyToWirePubKey;
/**
 * Converts Buffer containing an Ethereum address (link that stored in auth.msg links table)
 * Adds Ox and resturns as readable hex string
 * 20 bytes expected
 *
 * @param address 20 bytes buffer of eth address
 * @returns readable hex string of eth address with 0x prefix
 */
const ethAddressBufferToString = (address) => '0x' + Buffer.from(address).toString('hex');
exports.ethAddressBufferToString = ethAddressBufferToString;
//# sourceMappingURL=wire-utils.js.map