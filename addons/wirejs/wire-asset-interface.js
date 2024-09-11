"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpapAsset = void 0;
const regex = /([0-9]+)(([.]{1})([0-9]*)?)?(\ {1}[a-zA-Z]{3,5})/gs;
class UpapAsset {
    value = BigInt(0);
    precision = 0;
    symbol = 'TOK';
    alias;
    constructor(value, precision, symbol, alias) {
        if (typeof value == 'string' && !symbol && !alias) {
            if (new RegExp(regex).test(value)) {
                const exec = new RegExp(regex).exec(value);
                const [, int, dec, , prec, sym] = exec;
                this.value = BigInt(int + prec);
                this.precision = prec ? prec.length : 0;
                this.symbol = sym.trim().toUpperCase();
                if (precision && typeof precision == 'string') {
                    this.alias = precision;
                }
            }
            else {
                throw new Error('Invalid constructor arguments');
            }
        }
        else if (precision != undefined &&
            symbol != undefined &&
            typeof precision == 'number') {
            if (typeof value == 'string') {
                this.value = this.decimalToBigint(value, precision);
            }
            else {
                this.value = value;
            }
            this.precision = precision;
            this.symbol = symbol;
            this.alias = alias;
        }
        else {
            throw new Error('Invalid constructor arguments');
        }
    }
    toString() {
        const [integerPart, decimalPart] = this.splitValues();
        return `${integerPart}.${decimalPart} ${this.symbol}`;
    }
    toFixed(decimal) {
        // eslint-disable-next-line prefer-const
        let [integerPart, decimalPart] = this.splitValues();
        if (decimalPart.length < decimal)
            decimalPart = decimalPart.padEnd(decimal, '0');
        else if (decimalPart.length > decimal)
            decimalPart = decimalPart.slice(0, decimal);
        return `${integerPart}.${decimalPart} ${this.symbol}`;
    }
    splitValues() {
        let valueStr = this.value.toString();
        if (valueStr.length < this.precision)
            valueStr = valueStr.padStart(this.precision + 1, '0');
        const integerPart = valueStr.length - this.precision > 0
            ? valueStr.slice(0, valueStr.length - this.precision)
            : '0';
        const decimalPart = valueStr
            .slice(valueStr.length - this.precision)
            .padEnd(this.precision, '0');
        return [integerPart, decimalPart];
    }
    updatePrecision(precision) {
        if (precision < this.precision) {
            // shrink
            const dif = this.precision - precision;
            this.value /= BigInt(10 ** dif);
        }
        else if (precision > this.precision) {
            const dif = precision - this.precision;
            this.value *= BigInt(10 ** dif);
        }
        this.precision = precision;
    }
    // math operations
    add(asset) {
        let value;
        if (asset instanceof UpapAsset) {
            if (this.symbol !== asset.symbol) {
                throw "Can't add different assets";
            }
            if (this.precision !== asset.precision) {
                throw "Can't add different precisions";
            }
            value = asset.value;
        }
        else {
            value = this.decimalToBigint(asset);
        }
        return new UpapAsset(this.value + value, this.precision, this.symbol);
    }
    subtract(asset) {
        let value;
        if (asset instanceof UpapAsset) {
            if (this.symbol !== asset.symbol) {
                throw "Can't subtract different assets";
            }
            if (this.precision !== asset.precision) {
                throw "Can't subtract different precisions";
            }
            value = asset.value;
        }
        else {
            value = this.decimalToBigint(asset);
        }
        return new UpapAsset(this.value - value, this.precision, this.symbol);
    }
    multiply(n) {
        let value;
        let maxValue;
        if (typeof n === 'bigint') {
            value = n;
        }
        else if (typeof n === 'number') {
            if (Number.isInteger(n)) {
                value = BigInt(n);
            }
            else {
                // Case when number is decimal
                const numStrArr = n.toString().split('.');
                const integerValue = BigInt(numStrArr[0]);
                const fractionalValue = BigInt(numStrArr[1]);
                maxValue = BigInt(10 ** numStrArr[1].length);
                value = integerValue * maxValue + fractionalValue;
            }
        }
        else {
            maxValue = BigInt(10 ** n.precision);
            value = n.value;
        }
        return new UpapAsset((this.value * value) / (maxValue || BigInt(1)), this.precision, this.symbol);
    }
    divide(n) {
        // Beware of losing precision
        return new UpapAsset(this.value / n, this.precision, this.symbol);
    }
    lessThan(n, equalTo = false) {
        const i = this.decimalToBigint(n);
        return equalTo ? this.value <= i : this.value < i;
    }
    greaterThan(n, equalTo = false) {
        const i = this.decimalToBigint(n);
        return equalTo ? this.value >= i : this.value > i;
    }
    decimalToBigint(n, precision) {
        // eslint-disable-next-line prefer-const
        let [int, dec] = n.toString().split('.');
        dec = (dec || '').padEnd(precision || this.precision, '0');
        return BigInt(int + dec);
    }
}
exports.UpapAsset = UpapAsset;
//# sourceMappingURL=wire-asset-interface.js.map