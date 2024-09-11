export interface MsgDigest {
    message: string;
    messageHash: string;
    msg_digest: string;
    pre_hash_digest_hex: string;
    pre_hash_digest_uc: Uint8Array;
}
export interface MsgDigestPrivate extends MsgDigest {
    eth_addr: string;
    eth_sig: string;
    wire_sig: Uint8Array;
}
export interface SignHash {
    sig: string;
    eth_addr: string;
}
export interface SigPair {
    eth: string;
    wire: string;
}
