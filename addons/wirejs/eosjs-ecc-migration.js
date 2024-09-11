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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecc = void 0;
const eosjs_jssig_1 = require("./eosjs-jssig");
const eosjs_key_conversions_1 = require("./eosjs-key-conversions");
const eosjs_numeric_1 = require("./eosjs-numeric");
const eosjsKeyConversion = __importStar(require("./eosjs-key-conversions"));
exports.ecc = {
    initialize: () => console.error('Method deprecated'),
    unsafeRandomKey: () => console.error('Method deprecated'),
    randomKey: (cpuEntropyBits, options = {}) => {
        if (cpuEntropyBits !== undefined) {
            console.warn('Argument `cpuEntropyBits` is deprecated, ' +
                'use the options argument instead');
        }
        const { privateKey } = (0, eosjs_key_conversions_1.generateKeyPair)(eosjs_numeric_1.KeyType.k1, options);
        return Promise.resolve(privateKey.toLegacyString());
    },
    seedPrivate: () => console.error('Method deprecated'),
    privateToPublic: (key, pubkey_prefix) => {
        if (pubkey_prefix !== undefined) {
            console.warn('Argument `pubkey_prefix` is deprecated, ' +
                'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        }
        const privateKey = eosjs_jssig_1.PrivateKey.fromString(key);
        const publicKey = privateKey.getPublicKey();
        return publicKey.toLegacyString();
    },
    isValidPublic: (pubkey, pubkey_prefix) => {
        if (pubkey_prefix !== undefined) {
            console.warn('Argument `pubkey_prefix` is deprecated, ' +
                'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        }
        try {
            const publicKey = eosjs_jssig_1.PublicKey.fromString(pubkey);
            return publicKey.isValid();
        }
        catch {
            return false;
        }
    },
    isValidPrivate: (wif) => {
        try {
            const privateKey = eosjs_jssig_1.PrivateKey.fromString(wif);
            return privateKey.isValid();
        }
        catch {
            return false;
        }
    },
    sign: (data, privateKey, encoding = 'utf8') => {
        const privKey = typeof privateKey === 'string'
            ? eosjs_jssig_1.PrivateKey.fromString(privateKey)
            : privateKey;
        const signature = privKey.sign(data, true, encoding);
        return signature.toString();
    },
    signHash: (dataSha256, privateKey, encoding = 'hex') => {
        const privKey = typeof privateKey === 'string'
            ? eosjs_jssig_1.PrivateKey.fromString(privateKey)
            : privateKey;
        const signature = privKey.sign(dataSha256, false, encoding);
        return signature.toString();
    },
    verify: (signature, data, pubKey, encoding = 'utf8', hashData = true) => {
        const publicKey = typeof pubKey === 'string' ? eosjs_jssig_1.PublicKey.fromString(pubKey) : pubKey;
        const sig = eosjs_jssig_1.Signature.fromString(signature);
        return sig.verify(data, publicKey, hashData, encoding);
    },
    recover: (signature, data, encoding = 'utf8') => {
        const sig = eosjs_jssig_1.Signature.fromString(signature);
        const publicKey = sig.recover(data, true, encoding);
        return publicKey.toLegacyString();
    },
    recoverHash: (signature, dataSha256, encoding = 'hex') => {
        const sig = eosjs_jssig_1.Signature.fromString(signature);
        const publicKey = sig.recover(dataSha256, false, encoding);
        return publicKey.toLegacyString();
    },
    sha256: (data, resultEncoding, encoding) => {
        if (encoding !== undefined) {
            console.warn('Argument `encoding` is deprecated');
        }
        if (resultEncoding !== undefined) {
            console.warn('Argument `resultEncoding` is deprecated');
        }
        const result = eosjsKeyConversion.sha256(data);
        return result;
    },
};
//# sourceMappingURL=eosjs-ecc-migration.js.map