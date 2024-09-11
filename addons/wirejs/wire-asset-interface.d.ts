export declare class UpapAsset {
    value: bigint;
    precision: number;
    symbol: string;
    alias?: string;
    constructor(asset: string, alias?: string);
    constructor(value: string | bigint, precision: number, symbol: string, alias?: string);
    toString(): string;
    toFixed(decimal: number): string;
    splitValues(): [string, string];
    updatePrecision(precision: number): void;
    add(asset: UpapAsset | number | string): UpapAsset;
    subtract(asset: UpapAsset | number | string): UpapAsset;
    multiply(n: bigint | number | UpapAsset): UpapAsset;
    divide(n: bigint): UpapAsset;
    lessThan(n: number | string, equalTo?: boolean): boolean;
    greaterThan(n: number | string, equalTo?: boolean): boolean;
    decimalToBigint(n: number | string, precision?: number): bigint;
}
