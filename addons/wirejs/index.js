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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockMerkle = exports.Web3ConnectInterfaces = exports.Asset = exports.WnsInterfaces = exports.WireUtilsInterfaces = exports.WireNftInterfaces = exports.ChainServiceInterfaces = exports.Web3Connect = exports.WireUtils = exports.WnsService = exports.WireChainService = exports.WireNftService = exports.SerialBuffer = exports.Serialize = exports.RpcError = exports.RpcInterfaces = exports.Numeric = exports.JsonRpc = exports.ApiInterfaces = exports.Api = void 0;
// Default EOSJS exports
var eosjs_api_1 = require("./eosjs-api");
Object.defineProperty(exports, "Api", { enumerable: true, get: function () { return eosjs_api_1.Api; } });
exports.ApiInterfaces = __importStar(require("./eosjs-api-interfaces"));
var eosjs_jsonrpc_1 = require("./eosjs-jsonrpc");
Object.defineProperty(exports, "JsonRpc", { enumerable: true, get: function () { return eosjs_jsonrpc_1.JsonRpc; } });
exports.Numeric = __importStar(require("./eosjs-numeric"));
exports.RpcInterfaces = __importStar(require("./eosjs-rpc-interfaces"));
var eosjs_rpcerror_1 = require("./eosjs-rpcerror");
Object.defineProperty(exports, "RpcError", { enumerable: true, get: function () { return eosjs_rpcerror_1.RpcError; } });
exports.Serialize = __importStar(require("./eosjs-serialize"));
var eosjs_serialize_1 = require("./eosjs-serialize");
Object.defineProperty(exports, "SerialBuffer", { enumerable: true, get: function () { return eosjs_serialize_1.SerialBuffer; } });
// Added by Wire
exports.WireNftService = __importStar(require("./wire-nfts"));
exports.WireChainService = __importStar(require("./wire-chain-service"));
exports.WnsService = __importStar(require("./wire-wns"));
__exportStar(require("./wire-wns"), exports);
exports.WireUtils = __importStar(require("./wire-utils"));
exports.Web3Connect = __importStar(require("./wire-connect"));
exports.ChainServiceInterfaces = __importStar(require("./wire-chain-service-interfaces"));
exports.WireNftInterfaces = __importStar(require("./wire-nfts-interfaces"));
exports.WireUtilsInterfaces = __importStar(require("./wire-utils-interfaces"));
exports.WnsInterfaces = __importStar(require("./wire-wns-interfaces"));
exports.Asset = __importStar(require("./wire-asset-interface"));
exports.Web3ConnectInterfaces = __importStar(require("./wire-connect-interfaces"));
exports.BlockMerkle = __importStar(require("./wire-block-merkle-interface"));
__exportStar(require("./eosjs-api-interfaces"), exports);
__exportStar(require("./eosjs-api"), exports);
__exportStar(require("./eosjs-ecc-migration"), exports);
__exportStar(require("./eosjs-jsonrpc"), exports);
__exportStar(require("./eosjs-jssig"), exports);
__exportStar(require("./eosjs-rpc-interfaces"), exports);
__exportStar(require("./wire-asset-interface"), exports);
__exportStar(require("./wire-connect-interfaces"), exports);
__exportStar(require("./wire-nfts-interfaces"), exports);
__exportStar(require("./wire-wns-interfaces"), exports);
__exportStar(require("./wire-utils-interfaces"), exports);
__exportStar(require("./wire-chain-service-interfaces"), exports);
__exportStar(require("./wire-utils"), exports);
// export {
//     Api,
//     ApiInterfaces,
//     JsonRpc,
//     Numeric,
//     RpcInterfaces,
//     RpcError,
//     Serialize,
//     // WireNftService,
//     WireChainService,
//     WnsService,
//     WireUtils,
//     ChainServiceInterfaces,
//     WireNftInterfaces,
//     WireUtilsInterfaces,
//     WnsInterfaces,
//     Asset,
//     BlockMerkle,
//     Web3Connect,
//     Web3ConnectInterfaces,
// };
//# sourceMappingURL=index.js.map