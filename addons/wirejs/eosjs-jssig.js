"use strict";
/**
 * @module JS-Sig
 */
// copyright defined in eosjs/LICENSE.txt
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsSignatureProvider = exports.digestFromSerializedData = exports.Signature = exports.PublicKey = exports.PrivateKey = void 0;
const elliptic_1 = require("elliptic");
const eosjs_key_conversions_1 = require("./eosjs-key-conversions");
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return eosjs_key_conversions_1.PrivateKey; } });
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return eosjs_key_conversions_1.PublicKey; } });
Object.defineProperty(exports, "Signature", { enumerable: true, get: function () { return eosjs_key_conversions_1.Signature; } });
const eosjs_numeric_1 = require("./eosjs-numeric");
/** expensive to construct; so we do it once and reuse it */
const defaultEc = new elliptic_1.ec('secp256k1');
/** Construct the digest from transaction details */
const digestFromSerializedData = (chainId, serializedTransaction, serializedContextFreeData, e = defaultEc) => {
    const signBuf = Buffer.concat([
        Buffer.from(chainId, 'hex'),
        Buffer.from(serializedTransaction),
        Buffer.from(serializedContextFreeData
            ? new Uint8Array(e.hash().update(serializedContextFreeData).digest())
            : new Uint8Array(32)),
    ]);
    return e.hash().update(signBuf).digest();
    /*
        const eth_sig_digest = k256('x19<enter rest here>, e.hash().update(signBuf).digest());
    */
};
exports.digestFromSerializedData = digestFromSerializedData;
/** Signs transactions using in-process private keys */
class JsSignatureProvider {
    /** map public to private keys */
    keys = new Map();
    /** public keys */
    availableKeys = [];
    /** @param privateKeys private keys to sign with */
    constructor(privateKeys) {
        for (const k of privateKeys) {
            const priv = eosjs_key_conversions_1.PrivateKey.fromString(k);
            const privElliptic = priv.toElliptic();
            const pubStr = priv.getPublicKey().toString();
            this.keys.set(pubStr, privElliptic);
            this.availableKeys.push(pubStr);
        }
    }
    /** Public keys associated with the private keys that the `SignatureProvider` holds */
    async getAvailableKeys() {
        return this.availableKeys;
    }
    /** Sign a transaction */
    async sign({ chainId, requiredKeys, serializedTransaction, serializedContextFreeData, }) {
        const digest = digestFromSerializedData(chainId, serializedTransaction, serializedContextFreeData, defaultEc);
        const signatures = [];
        for (const key of requiredKeys) {
            const publicKey = eosjs_key_conversions_1.PublicKey.fromString(key);
            const ellipticPrivateKey = this.keys.get((0, eosjs_numeric_1.convertLegacyPublicKey)(key));
            const privateKey = eosjs_key_conversions_1.PrivateKey.fromElliptic(ellipticPrivateKey, publicKey.getType());
            const signature = privateKey.sign(digest, false);
            signatures.push(signature.toString());
        }
        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
exports.JsSignatureProvider = JsSignatureProvider;
//# sourceMappingURL=eosjs-jssig.js.map