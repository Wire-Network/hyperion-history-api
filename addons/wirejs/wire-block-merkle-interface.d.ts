import { SerialBuffer } from './eosjs-serialize';
export declare class BlockMerkle {
    constructor();
    hash(data: string): string;
    serBuffer(): SerialBuffer;
    bytesToHex(bytes: Uint8Array): string;
    calcTxMroot(txData: TxData[]): string;
    _calc(txData: TxData): string;
    txMerkle(txs: string[]): string;
    fullLegacyPrunableDigest(signatures: string[], pcfd: string[]): string;
    serializeSignature(signature: string): string;
}
declare const blockMerkle: BlockMerkle;
export default blockMerkle;
export interface TxData {
    tx_sigs: string[];
    packed_context_free_data: string[];
    compression: Compression;
    packed_tx: string;
    status: Status;
    cpu: number;
    net: number;
}
export declare enum Status {
    executed = "00",
    soft_fail = "01",
    hard_fail = "02",
    delayed = "03",
    expired = "04"
}
export declare enum Compression {
    none = "00",
    zlib = "01"
}
