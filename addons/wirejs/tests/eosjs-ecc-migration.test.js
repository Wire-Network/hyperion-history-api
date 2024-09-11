"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const ecc = require('eosjs-ecc');
const eosjs_ecc_migration_1 = require("../eosjs-ecc-migration");
const eosjs_ecc_migration_2 = require("../eosjs-ecc-migration");
const eosjs_key_conversions_1 = require("../eosjs-key-conversions");
describe('ecc Migration', () => {
    const privateKeys = [
        '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8',
        '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr',
        '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    ];
    const legacyPublicKeys = [
        'EOS7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhTU9ypi',
        'EOS8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es6aQk2F',
        'EOS7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw3wJEMu',
    ];
    it('verifies `initialize` returns console.error message', () => {
        console.error = jest.fn();
        eosjs_ecc_migration_2.ecc.initialize();
        expect(console.error).toHaveBeenCalledWith('Method deprecated');
    });
    it('verifies `unsafeRandomKey` returns console.error message', () => {
        console.error = jest.fn();
        eosjs_ecc_migration_2.ecc.unsafeRandomKey();
        expect(console.error).toHaveBeenCalledWith('Method deprecated');
    });
    it('verifies `randomKey` calls generateKeyPair', async () => {
        console.warn = jest.fn();
        const privateKey = await eosjs_ecc_migration_2.ecc.randomKey(0, { secureEnv: true });
        expect(console.warn).toHaveBeenCalledWith('Argument `cpuEntropyBits` is deprecated, ' +
            'use the options argument instead');
        expect(typeof privateKey).toEqual('string');
        expect(eosjs_key_conversions_1.PrivateKey.fromString(privateKey).isValid()).toBeTruthy();
    });
    it('verifies `seedPrivate` returns console.error message', () => {
        console.error = jest.fn();
        eosjs_ecc_migration_2.ecc.seedPrivate();
        expect(console.error).toHaveBeenCalledWith('Method deprecated');
    });
    it('verifies `privateToPublic` function is consistent between ecc objects', () => {
        console.warn = jest.fn();
        const eccPublicKey = eosjs_ecc_migration_1.ecc.privateToPublic(privateKeys[0], 'EOS');
        const eccMigrationPublicKey = eosjs_ecc_migration_2.ecc.privateToPublic(privateKeys[0], 'EOS');
        expect(console.warn).toHaveBeenCalledWith('Argument `pubkey_prefix` is deprecated, ' +
            'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        expect(eccPublicKey).toEqual(eccMigrationPublicKey);
    });
    it('verifies `isValidPublic` function is consistent between ecc objects', () => {
        console.warn = jest.fn();
        const eccValid = eosjs_ecc_migration_1.ecc.isValidPublic(legacyPublicKeys[0], 'EOS');
        const eccMigrationValid = eosjs_ecc_migration_2.ecc.isValidPublic(legacyPublicKeys[0], 'EOS');
        expect(console.warn).toHaveBeenCalledWith('Argument `pubkey_prefix` is deprecated, ' +
            'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeTruthy();
        expect(eccMigrationValid).toBeTruthy();
    });
    it('verifies `isValidPublic` function is consistent during an error', () => {
        console.warn = jest.fn();
        const eccValid = eosjs_ecc_migration_1.ecc.isValidPublic('publickey', 'EOS');
        const eccMigrationValid = eosjs_ecc_migration_2.ecc.isValidPublic('publickey', 'EOS');
        expect(console.warn).toHaveBeenCalledWith('Argument `pubkey_prefix` is deprecated, ' +
            'keys prefixed with PUB_K1_/PUB_R1_/PUB_WA_ going forward');
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeFalsy();
        expect(eccMigrationValid).toBeFalsy();
    });
    it('verifies `isValidPrivate` function is consistent between ecc objects', () => {
        const eccValid = eosjs_ecc_migration_1.ecc.isValidPrivate(privateKeys[0]);
        const eccMigrationValid = eosjs_ecc_migration_2.ecc.isValidPrivate(privateKeys[0]);
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeTruthy();
        expect(eccMigrationValid).toBeTruthy();
    });
    it('verifies `isValidPrivate` function is consistent during an error', () => {
        const eccValid = eosjs_ecc_migration_1.ecc.isValidPrivate('privatekey');
        const eccMigrationValid = eosjs_ecc_migration_2.ecc.isValidPrivate('privatekey');
        expect(eccValid).toEqual(eccMigrationValid);
        expect(eccValid).toBeFalsy();
        expect(eccMigrationValid).toBeFalsy();
    });
    it('verifies `sign`, `recover`, and `verify` functions are consistent between ecc objects', () => {
        const dataAsString = 'some string';
        const eccSig = eosjs_ecc_migration_1.ecc.sign(dataAsString, privateKeys[0], 'utf8');
        const eccMigrationSig = eosjs_ecc_migration_2.ecc.sign(dataAsString, privateKeys[0], 'utf8');
        // signatures are different
        expect(eccSig).not.toEqual(eccMigrationSig);
        const eccKPub = eosjs_ecc_migration_1.ecc.recover(eccSig, dataAsString, 'utf8');
        const eccMigrationKPub = eosjs_ecc_migration_2.ecc.recover(eccMigrationSig, dataAsString, 'utf8');
        expect(eccKPub).toEqual(eccMigrationKPub);
    });
    it('verifies `signHash`, `recoverHash`, and `sha256` functions are consistent between ecc objects', () => {
        console.warn = jest.fn();
        const dataAsString = 'some string';
        const eccHash = Buffer.from(eosjs_ecc_migration_1.ecc.sha256(dataAsString), 'hex');
        const eccMigrationHash = Buffer.from(eosjs_ecc_migration_2.ecc.sha256(dataAsString, 'hex', 'utf8'), 'hex');
        expect(console.warn).toBeCalledWith('Argument `encoding` is deprecated');
        expect(console.warn).toBeCalledWith('Argument `resultEncoding` is deprecated');
        expect(eccHash).toEqual(eccMigrationHash);
        const eccSig = eosjs_ecc_migration_1.ecc.signHash(eccHash, privateKeys[0], 'utf8');
        const eccMigrationSig = eosjs_ecc_migration_2.ecc.signHash(eccMigrationHash, privateKeys[0], 'utf8');
        // signatures are different
        expect(eccSig).not.toEqual(eccMigrationSig);
        const eccKPub = eosjs_ecc_migration_1.ecc.recoverHash(eccSig, eccHash, 'utf8');
        const eccMigrationKPub = eosjs_ecc_migration_2.ecc.recoverHash(eccSig, eccMigrationHash, 'utf8');
        expect(eccKPub).toEqual(eccMigrationKPub);
    });
});
//# sourceMappingURL=eosjs-ecc-migration.test.js.map