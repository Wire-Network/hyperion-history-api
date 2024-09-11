"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawStatus = void 0;
const SupportedNetworks = {
    '1': 'ETH_MAINNET',
    '1122334455': 'WIRES_ETH_TESTNET',
};
exports.default = SupportedNetworks;
var WithdrawStatus;
(function (WithdrawStatus) {
    WithdrawStatus[WithdrawStatus["SUBMITTED"] = 0] = "SUBMITTED";
    WithdrawStatus[WithdrawStatus["FINALIZED"] = 1] = "FINALIZED";
})(WithdrawStatus || (exports.WithdrawStatus = WithdrawStatus = {}));
//# sourceMappingURL=wire-wns-interfaces.js.map