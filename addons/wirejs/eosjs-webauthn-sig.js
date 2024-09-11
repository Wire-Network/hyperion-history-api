"use strict";
/**
 * @module WebAuthn-Sig
 */
// copyright defined in eosjs/LICENSE.txt
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
exports.WebAuthnSignatureProvider = void 0;
const ser = __importStar(require("./eosjs-serialize"));
const numeric = __importStar(require("./eosjs-numeric"));
const elliptic_1 = require("elliptic");
/** Signs transactions using WebAuthn */
class WebAuthnSignatureProvider {
    /** Map public key to credential ID (hex). User must populate this. */
    keys = new Map();
    /** Public keys that the `SignatureProvider` holds */
    async getAvailableKeys() {
        return Array.from(this.keys.keys());
    }
    /** Sign a transaction */
    async sign({ chainId, requiredKeys, serializedTransaction, serializedContextFreeData, }) {
        const signBuf = new ser.SerialBuffer();
        signBuf.pushArray(ser.hexToUint8Array(chainId));
        signBuf.pushArray(serializedTransaction);
        if (serializedContextFreeData) {
            signBuf.pushArray(new Uint8Array(await crypto.subtle.digest('SHA-256', serializedContextFreeData.buffer)));
        }
        else {
            signBuf.pushArray(new Uint8Array(32));
        }
        const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', signBuf.asUint8Array().slice().buffer));
        const signatures = [];
        for (const key of requiredKeys) {
            const id = ser.hexToUint8Array(this.keys.get(key));
            const assertion = await navigator.credentials.get({
                publicKey: {
                    timeout: 60000,
                    allowCredentials: [
                        {
                            id,
                            type: 'public-key',
                        },
                    ],
                    challenge: digest.buffer,
                },
            });
            const e = new elliptic_1.ec('p256'); // https://github.com/indutny/elliptic/pull/232
            const pubKey = e
                .keyFromPublic(numeric.stringToPublicKey(key).data.subarray(0, 33))
                .getPublic();
            const fixup = (x) => {
                const a = Array.from(x);
                while (a.length < 32) {
                    a.unshift(0);
                }
                while (a.length > 32) {
                    if (a.shift() !== 0) {
                        throw new Error('Signature has an r or s that is too big');
                    }
                }
                return new Uint8Array(a);
            };
            const der = new ser.SerialBuffer({
                array: new Uint8Array(assertion.response.signature),
            });
            if (der.get() !== 0x30) {
                throw new Error('Signature missing DER prefix');
            }
            if (der.get() !== der.array.length - 2) {
                throw new Error('Signature has bad length');
            }
            if (der.get() !== 0x02) {
                throw new Error('Signature has bad r marker');
            }
            const r = fixup(der.getUint8Array(der.get()));
            if (der.get() !== 0x02) {
                throw new Error('Signature has bad s marker');
            }
            const s = fixup(der.getUint8Array(der.get()));
            const whatItReallySigned = new ser.SerialBuffer();
            whatItReallySigned.pushArray(new Uint8Array(assertion.response.authenticatorData));
            whatItReallySigned.pushArray(new Uint8Array(await crypto.subtle.digest('SHA-256', assertion.response.clientDataJSON)));
            const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', whatItReallySigned.asUint8Array().slice()));
            const recid = e.getKeyRecoveryParam(hash, new Uint8Array(assertion.response.signature), pubKey);
            const sigData = new ser.SerialBuffer();
            sigData.push(recid + 27 + 4);
            sigData.pushArray(r);
            sigData.pushArray(s);
            sigData.pushBytes(new Uint8Array(assertion.response.authenticatorData));
            sigData.pushBytes(new Uint8Array(assertion.response.clientDataJSON));
            const sig = numeric.signatureToString({
                type: numeric.KeyType.wa,
                data: sigData.asUint8Array().slice(),
            });
            signatures.push(sig);
        }
        return { signatures, serializedTransaction, serializedContextFreeData };
    }
}
exports.WebAuthnSignatureProvider = WebAuthnSignatureProvider;
//# sourceMappingURL=eosjs-webauthn-sig.js.map