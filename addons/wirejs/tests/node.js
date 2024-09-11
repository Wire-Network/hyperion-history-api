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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const fetch = __importStar(require("node-fetch"));
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("../eosjs-jssig");
const util_1 = require("util");
const privateKey = '5JuH9fCXmU3xbj8nRmhPZaVrxxXrdPaRmZLW1cznNTmTQR2Kg5Z'; // replace with "bob" account private key
const r1PrivateKey = 'PVT_R1_GrfEfbv5at9kbeHcGagQmvbFLdm6jqEpgE1wsGbrfbZNjpVgT';
const cfactorPrivateKey = '5K8Sm2bB2b7ZC8tJMefrk1GFa4jgtHxxHRcjX49maMk9AEwq8hN';
/* new accounts for testing can be created by unlocking a cleos wallet then calling:
 * 1) cleos create key --to-console (copy this privateKey & publicKey)
 * 2) cleos wallet import
 * 3) cleos create account bob publicKey
 * 4) cleos create account alice publicKey
 */
const rpc = new eosjs_1.JsonRpc('http://localhost:8888', { fetch });
const signatureProvider = new eosjs_jssig_1.JsSignatureProvider([
    privateKey,
    r1PrivateKey,
    cfactorPrivateKey,
]);
const api = new eosjs_1.Api({
    rpc,
    signatureProvider,
    textDecoder: new util_1.TextDecoder(),
    textEncoder: new util_1.TextEncoder(),
});
const transactWithConfig = async (config, memo, from = 'bob', to = 'alice') => {
    return await api.transact({
        actions: [
            {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [
                    {
                        actor: from,
                        permission: 'active',
                    },
                ],
                data: {
                    from,
                    to,
                    quantity: '0.0001 SYS',
                    memo,
                },
            },
        ],
    }, config);
};
const transactWithoutConfig = async () => {
    const transactionResponse = await transactWithConfig({ blocksBehind: 3, expireSeconds: 30 }, 'transactWithoutConfig');
    const blockInfo = await rpc.get_block_info(transactionResponse.processed.block_num - 3);
    const currentDate = new Date();
    const timePlusTen = currentDate.getTime() + 10000;
    const timeInISOString = new Date(timePlusTen).toISOString();
    const expiration = timeInISOString.substr(0, timeInISOString.length - 1);
    return await api.transact({
        expiration,
        ref_block_num: blockInfo.block_num & 0xffff,
        ref_block_prefix: blockInfo.ref_block_prefix,
        actions: [
            {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [
                    {
                        actor: 'bob',
                        permission: 'active',
                    },
                ],
                data: {
                    from: 'bob',
                    to: 'alice',
                    quantity: '0.0001 SYS',
                    memo: 'transactWithoutConfig2',
                },
            },
        ],
    });
};
const transactWithContextFreeAction = async () => {
    return await api.transact({
        actions: [
            {
                account: 'cfhello',
                name: 'normal',
                authorization: [
                    {
                        actor: 'cfactor',
                        permission: 'active',
                    },
                ],
                data: {
                    user: 'test',
                },
            },
        ],
        context_free_actions: [
            {
                account: 'cfhello',
                name: 'contextfree',
                authorization: [],
                data: {},
            },
        ],
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithContextFreeData = async () => {
    return await api.transact({
        actions: [
            {
                account: 'cfhello',
                name: 'normal',
                authorization: [
                    {
                        actor: 'cfactor',
                        permission: 'active',
                    },
                ],
                data: {
                    user: 'test2',
                },
            },
        ],
        context_free_actions: [
            {
                account: 'cfhello',
                name: 'contextfree',
                authorization: [],
                data: {},
            },
        ],
        context_free_data: [['74657374', '7465737464617461']],
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithShorthandApiJson = async () => {
    await api.getAbi('eosio.token');
    return await api.transact({
        actions: [
            api
                .with('eosio.token')
                .as('bob')
                .transfer('bob', 'alice', '0.0001 SYS', 'transactWithShorthandApiJson'),
        ],
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithShorthandTxJson = async () => {
    await api.getAbi('eosio.token');
    const tx = api.buildTransaction();
    tx.with('eosio.token')
        .as('bob')
        .transfer('bob', 'alice', '0.0001 SYS', 'transactWithShorthandTxJson');
    return await tx.send({
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithShorthandTxJsonContextFreeAction = async () => {
    await api.getAbi('cfhello');
    const tx = api.buildTransaction();
    tx.associateContextFree(() => ({
        contextFreeAction: tx.with('cfhello').as().contextfree(),
        action: tx.with('cfhello').as('cfactor').normal('test'),
    }));
    return await tx.send({
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithShorthandTxJsonContextFreeData = async () => {
    await api.getAbi('cfhello');
    const tx = api.buildTransaction();
    tx.associateContextFree(() => ({
        contextFreeData: ['74657374', '7465737464617461'],
        contextFreeAction: tx.with('cfhello').as().contextfree(),
        action: tx.with('cfhello').as('cfactor').normal('test2'),
    }));
    return await tx.send({
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithReturnValue = async () => {
    await api.getAbi('returnvalue');
    const tx = api.buildTransaction();
    tx.with('returnvalue').as('bob').sum(5, 5);
    return await tx.send({
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const transactWithResourcePayer = async () => {
    return await api.transact({
        resource_payer: {
            payer: 'alice',
            max_net_bytes: 4096,
            max_cpu_us: 400,
            max_memory_bytes: 0,
        },
        actions: [
            {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [
                    {
                        actor: 'bob',
                        permission: 'active',
                    },
                    {
                        actor: 'alice',
                        permission: 'active',
                    },
                ],
                data: {
                    from: 'bob',
                    to: 'alice',
                    quantity: '0.0001 SYS',
                    memo: 'resource payer',
                },
            },
        ],
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
};
const readOnlyQuery = async () => {
    return await api.transact({
        actions: [
            {
                account: 'readonly',
                name: 'get',
                authorization: [
                    {
                        actor: 'readonly',
                        permission: 'active',
                    },
                ],
                data: {},
            },
        ],
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
        compression: true,
        readOnlyTrx: true,
    });
};
const readOnlyFailureTrace = async () => {
    return await api.transact({
        actions: [
            {
                account: 'eosio',
                name: 'setpriv',
                authorization: [
                    {
                        actor: 'bob',
                        permission: 'active',
                    },
                ],
                data: {
                    account: 'bob',
                    is_priv: '1',
                },
            },
        ],
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
        readOnlyTrx: true,
        returnFailureTraces: true,
    });
};
const broadcastResult = async (signaturesAndPackedTransaction) => await api.pushSignedTransaction(signaturesAndPackedTransaction);
const transactShouldFail = async () => await api.transact({
    actions: [
        {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [
                {
                    actor: 'bob',
                    permission: 'active',
                },
            ],
            data: {
                from: 'bob',
                to: 'alice',
                quantity: '0.0001 SYS',
                memo: '',
            },
        },
    ],
});
const rpcShouldFail = async () => await rpc.get_block_info(-1);
module.exports = {
    transactWithConfig,
    transactWithoutConfig,
    transactWithContextFreeAction,
    transactWithContextFreeData,
    broadcastResult,
    transactShouldFail,
    transactWithShorthandApiJson,
    transactWithShorthandTxJson,
    transactWithShorthandTxJsonContextFreeAction,
    transactWithShorthandTxJsonContextFreeData,
    transactWithReturnValue,
    transactWithResourcePayer,
    readOnlyQuery,
    readOnlyFailureTrace,
    rpcShouldFail,
};
//# sourceMappingURL=node.js.map