"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compression = exports.Status = exports.BlockMerkle = void 0;
// import base58 from "bs58";
const ethers_1 = require("ethers");
const crypto_1 = require("crypto");
const eosjs_serialize_1 = require("./eosjs-serialize");
class BlockMerkle {
    constructor() { }
    hash(data) {
        return (0, crypto_1.createHash)('sha256')
            .update(Buffer.from(data, 'hex'))
            .digest('hex');
    }
    serBuffer() {
        return new eosjs_serialize_1.SerialBuffer({
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder(),
        });
    }
    bytesToHex(bytes) {
        return Array.from(bytes)
            .map(byte => {
            const hex = new Number(byte).toString(16);
            return hex.padStart(2, '0');
        })
            .join('');
    }
    calcTxMroot(txData) {
        return this.txMerkle(txData.map(l => this._calc(l)));
    }
    _calc(txData) {
        const tx_types = (0, eosjs_serialize_1.createTransactionTypes)();
        const serializeBytes = (data) => {
            const b = tx_types.get('bytes');
            const buff = this.serBuffer();
            b.serialize(buff, data);
            return Buffer.from(buff.asUint8Array()).toString('hex');
        };
        const hexToUint8Array = function (hex) {
            if (hex.length % 2) {
                throw new Error('Odd number of hex digits');
            }
            const l = hex.length / 2;
            const result = new Uint8Array(l);
            for (let i = 0; i < l; ++i) {
                const x = parseInt(hex.substr(i * 2, 2), 16);
                if (Number.isNaN(x)) {
                    throw new Error('Expected hex string');
                }
                result[i] = x;
            }
            return result;
        };
        const prunable_digest = this.fullLegacyPrunableDigest(txData.tx_sigs, txData.packed_context_free_data);
        const packed_trx = serializeBytes(hexToUint8Array(txData.packed_tx));
        const packed_digest = (0, crypto_1.createHash)('sha256')
            .update(Buffer.from(txData.compression + packed_trx + prunable_digest, 'hex'))
            .digest('hex');
        console.log('Packed', packed_digest);
        const cpu = () => {
            const buff = this.serBuffer();
            const uint32_type = tx_types.get('uint32');
            uint32_type.serialize(buff, txData.cpu);
            return Buffer.from(buff.asUint8Array()).toString('hex');
        };
        const net = () => {
            const buff = this.serBuffer();
            const varUint32_type = tx_types.get('varuint32');
            varUint32_type.serialize(buff, txData.net);
            return Buffer.from(buff.asUint8Array()).toString('hex');
        };
        const digest = txData.status + cpu() + net() + packed_digest;
        const leaf = (0, crypto_1.createHash)('sha256')
            .update(Buffer.from(digest, 'hex'))
            .digest('hex');
        return leaf;
    }
    txMerkle(txs) {
        const hash = (leaf1, leaf2) => {
            if (leaf2)
                return this.hash(leaf1 + leaf2);
            return this.hash(leaf1);
        };
        if (txs.length === 0) {
            return '';
        }
        console.log('before', txs, txs.length % 2);
        // if(txs.length === 1) return hash(txs[0], txs[0])
        while (txs.length > 1) {
            if (txs.length % 2 !== 0) {
                console.log('PUSHED', txs);
                txs.push(txs[txs.length - 1]);
            }
            for (let i = 0; i < txs.length / 2; i++) {
                // txs[i] = createHash('sha256').update(txs[2 * i] + txs[2 * i + 1], 'hex').digest('hex');
                txs[i] = hash(txs[2 * i], txs[2 * i + 1]);
            }
            txs = txs.slice(0, txs.length / 2);
        }
        console.log(txs);
        return txs[0];
    }
    fullLegacyPrunableDigest(signatures, pcfd) {
        if (signatures.length > 15) {
            console.log('this is the special case. need to handle');
            return '';
        }
        let result = '';
        const sigLengthBytes = signatures.length.toString(16).padStart(2, '0');
        result += sigLengthBytes;
        if (signatures.length)
            for (const signature of signatures)
                result += this.serializeSignature(signature);
        const pcfdLengthBytes = pcfd.length.toString(16).padStart(2, '0');
        result += pcfdLengthBytes;
        if (pcfd.length) {
            // will find out how to do this later
        }
        return (0, crypto_1.createHash)('sha256')
            .update(Buffer.from(result, 'hex'))
            .digest('hex');
    }
    serializeSignature(signature) {
        let curve;
        if (!signature.startsWith('SIG_K1_') &&
            !signature.startsWith('SIG_R1_') &&
            !signature.startsWith('SIG_EM_')) {
            console.log('Invalid signature type', signature);
            return signature;
        }
        switch (signature.slice(0, 7)) {
            case 'SIG_K1_':
                curve = '00';
                break;
            case 'SIG_R1_':
                curve = '01';
                break;
            case 'SIG_EM_':
                curve = '03';
                break;
            default:
                curve = '00';
        }
        // signature.startsWith('SIG_R1_') ? curve = '01' : curve = '00';
        // remove prefix and base58 decode, turn into a hex
        let decoded_sig = Buffer.from(ethers_1.ethers.utils.base58.decode(signature.substring(7))).toString('hex');
        // console.log({ decoded_sig_with_checksum: decoded_sig, length: decoded_sig.length });
        decoded_sig = decoded_sig.substring(0, decoded_sig.length - 8);
        // we prepend with 00 because we are wanting to signal the curve. 0 is k1. 0 to hex is 00
        console.log(signature, curve + decoded_sig);
        return curve + decoded_sig;
    }
}
exports.BlockMerkle = BlockMerkle;
const blockMerkle = new BlockMerkle();
exports.default = blockMerkle;
var Status;
(function (Status) {
    Status["executed"] = "00";
    Status["soft_fail"] = "01";
    Status["hard_fail"] = "02";
    Status["delayed"] = "03";
    Status["expired"] = "04";
})(Status || (exports.Status = Status = {}));
var Compression;
(function (Compression) {
    Compression["none"] = "00";
    Compression["zlib"] = "01";
})(Compression || (exports.Compression = Compression = {}));
//# sourceMappingURL=wire-block-merkle-interface.js.map