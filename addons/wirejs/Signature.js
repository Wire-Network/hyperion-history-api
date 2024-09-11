"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const eosjs_numeric_1 = require("./eosjs-numeric");
const eosjs_key_conversions_1 = require("./eosjs-key-conversions");
/** Represents/stores a Signature and provides easy conversion for use with `elliptic` lib */
class Signature {
    signature;
    ec;
    constructor(signature, ec) {
        this.signature = signature;
        this.ec = ec;
    }
    /** Instantiate Signature from an EOSIO-format Signature */
    static fromString(sig, ec) {
        const signature = (0, eosjs_numeric_1.stringToSignature)(sig);
        if (!ec) {
            ec = (0, eosjs_key_conversions_1.constructElliptic)(signature.type);
        }
        return new Signature(signature, ec);
    }
    /** Instantiate Signature from an `elliptic`-format Signature */
    static fromElliptic(ellipticSig, keyType, ec) {
        const r = ellipticSig.r.toArray('be', 32);
        const s = ellipticSig.s.toArray('be', 32);
        let eosioRecoveryParam;
        if (keyType === eosjs_numeric_1.KeyType.k1 ||
            keyType === eosjs_numeric_1.KeyType.r1 ||
            keyType === eosjs_numeric_1.KeyType.em) {
            eosioRecoveryParam = ellipticSig.recoveryParam || 0 + 27;
            if (ellipticSig.recoveryParam <= 3 && keyType !== eosjs_numeric_1.KeyType.em) {
                eosioRecoveryParam += 4;
            }
        }
        else if (keyType === eosjs_numeric_1.KeyType.wa) {
            eosioRecoveryParam = ellipticSig.recoveryParam;
        }
        const sigData = keyType !== eosjs_numeric_1.KeyType.em
            ? new Uint8Array([eosioRecoveryParam].concat(r, s))
            : new Uint8Array(r.concat(s, [eosioRecoveryParam]));
        if (!ec) {
            ec = (0, eosjs_key_conversions_1.constructElliptic)(keyType);
        }
        return new Signature({
            type: keyType,
            data: sigData,
        }, ec);
    }
    /** Export Signature as `elliptic`-format Signature
     * NOTE: This isn't an actual elliptic-format Signature, as ec.Signature is not exported by the library.
     * That's also why the return type is `any`.  We're *actually* returning an object with the 3 params
     * not an ec.Signature.
     * Further NOTE: @types/elliptic shows ec.Signature as exported; it is *not*.  Hence the `any`.
     */
    toElliptic() {
        const lengthOfR = 32;
        const lengthOfS = 32;
        const r = new bn_js_1.default(this.signature.data.slice(1, lengthOfR + 1));
        const s = new bn_js_1.default(this.signature.data.slice(lengthOfR + 1, lengthOfR + lengthOfS + 1));
        let ellipticRecoveryBitField;
        if (this.signature.type === eosjs_numeric_1.KeyType.k1 ||
            this.signature.type === eosjs_numeric_1.KeyType.r1 ||
            this.signature.type === eosjs_numeric_1.KeyType.em) {
            ellipticRecoveryBitField = this.signature.data[0] - 27;
            if (ellipticRecoveryBitField > 3 &&
                this.signature.type !== eosjs_numeric_1.KeyType.em) {
                ellipticRecoveryBitField -= 4;
            }
        }
        else if (this.signature.type === eosjs_numeric_1.KeyType.wa) {
            ellipticRecoveryBitField = this.signature.data[0];
        }
        const recoveryParam = ellipticRecoveryBitField & 3;
        return { r, s, recoveryParam };
    }
    /** Export Signature as EOSIO-format Signature */
    toString() {
        return (0, eosjs_numeric_1.signatureToString)(this.signature);
    }
    /** Export Signature in binary format */
    toBinary() {
        return this.signature.data;
    }
    /** Get key type from signature */
    getType() {
        return this.signature.type;
    }
    /** Verify a signature with a message or hashed message digest and public key */
    verify(data, publicKey, shouldHash = true, encoding = 'utf8') {
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        const ellipticSignature = this.toElliptic();
        const ellipticPublicKey = publicKey.toElliptic();
        return this.ec.verify(data, ellipticSignature, ellipticPublicKey, encoding);
    }
    /** Recover a public key from a message or hashed message digest and signature */
    recover(data, shouldHash = true, encoding = 'utf8') {
        if (shouldHash) {
            if (typeof data === 'string') {
                data = Buffer.from(data, encoding);
            }
            data = this.ec.hash().update(data).digest();
        }
        const ellipticSignature = this.toElliptic();
        const recoveredPublicKey = this.ec.recoverPubKey(data, ellipticSignature, ellipticSignature.recoveryParam, encoding);
        const ellipticKPub = this.ec.keyFromPublic(recoveredPublicKey);
        return eosjs_key_conversions_1.PublicKey.fromElliptic(ellipticKPub, this.getType(), this.ec);
    }
}
exports.Signature = Signature;
//# sourceMappingURL=Signature.js.map