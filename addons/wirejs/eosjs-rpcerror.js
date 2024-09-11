"use strict";
/**
 * @module RPC-Error
 */
// copyright defined in eosjs/LICENSE.txt
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcError = void 0;
/** Holds detailed error information */
class RpcError extends Error {
    /** Detailed error information */
    json;
    details;
    constructor(json) {
        if (json.error &&
            json.error.details &&
            json.error.details.length &&
            json.error.details[0].message) {
            super(json.error.details[0].message);
            this.details = json.error.details;
        }
        else if (json.processed &&
            json.processed.except &&
            json.processed.except.message) {
            super(json.processed.except.message);
            this.details = json.processed.except;
        }
        else if (json.result &&
            json.result.except &&
            json.result.except.message) {
            super(json.result.except.message);
            this.details = json.result.except;
        }
        else {
            super(json.message);
        }
        Object.setPrototypeOf(this, RpcError.prototype);
        this.json = json;
    }
}
exports.RpcError = RpcError;
//# sourceMappingURL=eosjs-rpcerror.js.map