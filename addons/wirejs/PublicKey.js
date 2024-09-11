"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKey = void 0;
const eosjs_numeric_1 = require("./eosjs-numeric");
const eosjs_key_conversions_1 = require("./eosjs-key-conversions");
/** Represents/stores a public key and provides easy conversion for use with `elliptic` lib */
class PublicKey {
    key;
    ec;
    constructor(key, ec) {
        this.key = key;
        this.ec = ec;
    }
    /** Instantiate public key from an EOSIO-format public key */
    static fromString(publicKeyStr, ec) {
        const key = (0, eosjs_numeric_1.stringToPublicKey)(publicKeyStr);
        if (!ec) {
            ec = (0, eosjs_key_conversions_1.constructElliptic)(key.type);
        }
        return new PublicKey(key, ec);
    }
    /** Instantiate public key from an `elliptic`-format public key */
    static fromElliptic(publicKey, keyType, ec) {
        const x = publicKey.getPublic().getX().toArray('be', 32);
        const y = publicKey.getPublic().getY().toArray('be', 32);
        if (!ec) {
            ec = (0, eosjs_key_conversions_1.constructElliptic)(keyType);
        }
        return new PublicKey({
            type: keyType,
            data: new Uint8Array([y[31] & 1 ? 3 : 2].concat(x)),
        }, ec);
    }
    /** Export public key as EOSIO-format public key */
    toString() {
        return (0, eosjs_numeric_1.publicKeyToString)(this.key);
    }
    /** Export public key as Legacy EOSIO-format public key */
    toLegacyString() {
        return (0, eosjs_numeric_1.publicKeyToLegacyString)(this.key);
    }
    /** Export public key as `elliptic`-format public key */
    toElliptic() {
        return this.ec.keyPair({
            pub: Buffer.from(this.key.data),
        });
    }
    /** Get key type from key */
    getType() {
        return this.key.type;
    }
    /** Validate a public key */
    isValid() {
        try {
            const ellipticPublicKey = this.toElliptic();
            const validationObj = ellipticPublicKey.validate();
            return validationObj.result;
        }
        catch {
            return false;
        }
    }
}
exports.PublicKey = PublicKey;
//# sourceMappingURL=PublicKey.js.map