export class RIPEMD160 {
    static get_n_pad_bytes(message_size: any): number;
    static pad(message: any): ArrayBufferLike;
    static f(j: any, x: any, y: any, z: any): number;
    static K(j: any): 0 | 1518500249 | 1859775393 | 2400959708 | 2840853838;
    static KP(j: any): 0 | 1352829926 | 1548603684 | 1836072691 | 2053994217;
    static add_modulo32(...args: any[]): number;
    static rol32(value: any, count: any): number;
    static hash(message: any): ArrayBuffer;
}
