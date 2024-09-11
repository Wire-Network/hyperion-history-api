"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ERC20Withdraw_ABI = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_timeLockPeriod',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_stateAddr',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_bucketAddr',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'newBucketAddr',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'oldBucketAddr',
                type: 'address',
            },
        ],
        name: 'BucketAddressChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'newChallengeResolver',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'oldChallengeResolver',
                type: 'address',
            },
        ],
        name: 'ChallengeResolverChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'actor',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'recipient',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'contractAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timeLock',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'bSD',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'bID',
                type: 'bytes32',
            },
        ],
        name: 'InitiatedWithdrawal',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'oldOwner',
                type: 'address',
            },
        ],
        name: 'OwnerChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'newStateAddr',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'oldStateAddr',
                type: 'address',
            },
        ],
        name: 'StateAddressChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'newTimeLockPeriod',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'oldTimeLockPeriod',
                type: 'uint256',
            },
        ],
        name: 'TimeLockPeriodChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'actor',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'recipient',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'contractAddress',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bytes32',
                name: 'key',
                type: 'bytes32',
            },
        ],
        name: 'Withdrawal',
        type: 'event',
    },
    {
        inputs: [],
        name: 'bucketAddr',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'challengeResolverAddr',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'account',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        components: [
                            {
                                internalType: 'string',
                                name: 'actor',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'permission',
                                type: 'string',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.Authorization[]',
                        name: 'authorization',
                        type: 'tuple[]',
                    },
                    {
                        components: [
                            {
                                internalType: 'address',
                                name: 'contractAddress',
                                type: 'address',
                            },
                            {
                                internalType: 'uint128',
                                name: 'amountWhole',
                                type: 'uint128',
                            },
                            {
                                internalType: 'uint128',
                                name: 'amountDecimal',
                                type: 'uint128',
                            },
                            {
                                internalType: 'uint8',
                                name: 'precision',
                                type: 'uint8',
                            },
                            {
                                internalType: 'address',
                                name: 'to',
                                type: 'address',
                            },
                            {
                                internalType: 'string',
                                name: 'from',
                                type: 'string',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.WithdrawActionData20',
                        name: 'data',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct TxMrootWNS.WithdrawalAction20',
                name: 'action',
                type: 'tuple',
            },
            {
                components: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        internalType: 'uint256',
                                        name: '_timestamp',
                                        type: 'uint256',
                                    },
                                    {
                                        internalType: 'string',
                                        name: '_producer',
                                        type: 'string',
                                    },
                                    {
                                        internalType: 'uint16',
                                        name: '_confirmed',
                                        type: 'uint16',
                                    },
                                    {
                                        internalType: 'bytes32',
                                        name: '_previous',
                                        type: 'bytes32',
                                    },
                                    {
                                        internalType: 'bytes32',
                                        name: '_txMroot',
                                        type: 'bytes32',
                                    },
                                    {
                                        internalType: 'bytes32',
                                        name: '_actMroot',
                                        type: 'bytes32',
                                    },
                                    {
                                        internalType: 'uint32',
                                        name: '_scheduleVersion',
                                        type: 'uint32',
                                    },
                                ],
                                internalType: 'struct Header.BlockHeader',
                                name: 'header',
                                type: 'tuple',
                            },
                            {
                                internalType: 'bytes32',
                                name: '_blockMroot',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'bytes32',
                                name: '_scheduleHash',
                                type: 'bytes32',
                            },
                        ],
                        internalType: 'struct Header.BlockTest',
                        name: 'header',
                        type: 'tuple',
                    },
                    {
                        components: [
                            {
                                internalType: 'address',
                                name: 'signer',
                                type: 'address',
                            },
                            {
                                internalType: 'bytes32',
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'bytes32',
                                name: 's',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'uint8',
                                name: 'v',
                                type: 'uint8',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.PointSigValues',
                        name: 'pointSigValues',
                        type: 'tuple',
                    },
                    {
                        internalType: 'bytes32[]',
                        name: 'txLeafNodes',
                        type: 'bytes32[]',
                    },
                    {
                        components: [
                            {
                                internalType: 'bytes[]',
                                name: 'tx_sigs',
                                type: 'bytes[]',
                            },
                            {
                                internalType: 'bytes[]',
                                name: 'packed_context_free_data',
                                type: 'bytes[]',
                            },
                            {
                                internalType: 'enum TxMrootWNS.Compression',
                                name: 'compression',
                                type: 'uint8',
                            },
                            {
                                internalType: 'bytes',
                                name: 'packed_tx',
                                type: 'bytes',
                            },
                            {
                                internalType: 'enum TxMrootWNS.Status',
                                name: 'status',
                                type: 'uint8',
                            },
                            {
                                internalType: 'uint32',
                                name: 'cpu',
                                type: 'uint32',
                            },
                            {
                                internalType: 'uint32',
                                name: 'net',
                                type: 'uint32',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.TxData',
                        name: 'wTxData',
                        type: 'tuple',
                    },
                    {
                        internalType: 'uint256',
                        name: 'wIndex',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct InitWithdrawalBlock',
                name: 'iwd',
                type: 'tuple',
            },
        ],
        name: 'getKey',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'key',
                type: 'bytes32',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'account',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        components: [
                            {
                                internalType: 'string',
                                name: 'actor',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'permission',
                                type: 'string',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.Authorization[]',
                        name: 'authorization',
                        type: 'tuple[]',
                    },
                    {
                        components: [
                            {
                                internalType: 'address',
                                name: 'contractAddress',
                                type: 'address',
                            },
                            {
                                internalType: 'uint128',
                                name: 'amountWhole',
                                type: 'uint128',
                            },
                            {
                                internalType: 'uint128',
                                name: 'amountDecimal',
                                type: 'uint128',
                            },
                            {
                                internalType: 'uint8',
                                name: 'precision',
                                type: 'uint8',
                            },
                            {
                                internalType: 'address',
                                name: 'to',
                                type: 'address',
                            },
                            {
                                internalType: 'string',
                                name: 'from',
                                type: 'string',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.WithdrawActionData20',
                        name: 'data',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct TxMrootWNS.WithdrawalAction20',
                name: 'action',
                type: 'tuple',
            },
            {
                components: [
                    {
                        components: [
                            {
                                components: [
                                    {
                                        internalType: 'uint256',
                                        name: '_timestamp',
                                        type: 'uint256',
                                    },
                                    {
                                        internalType: 'string',
                                        name: '_producer',
                                        type: 'string',
                                    },
                                    {
                                        internalType: 'uint16',
                                        name: '_confirmed',
                                        type: 'uint16',
                                    },
                                    {
                                        internalType: 'bytes32',
                                        name: '_previous',
                                        type: 'bytes32',
                                    },
                                    {
                                        internalType: 'bytes32',
                                        name: '_txMroot',
                                        type: 'bytes32',
                                    },
                                    {
                                        internalType: 'bytes32',
                                        name: '_actMroot',
                                        type: 'bytes32',
                                    },
                                    {
                                        internalType: 'uint32',
                                        name: '_scheduleVersion',
                                        type: 'uint32',
                                    },
                                ],
                                internalType: 'struct Header.BlockHeader',
                                name: 'header',
                                type: 'tuple',
                            },
                            {
                                internalType: 'bytes32',
                                name: '_blockMroot',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'bytes32',
                                name: '_scheduleHash',
                                type: 'bytes32',
                            },
                        ],
                        internalType: 'struct Header.BlockTest',
                        name: 'header',
                        type: 'tuple',
                    },
                    {
                        components: [
                            {
                                internalType: 'address',
                                name: 'signer',
                                type: 'address',
                            },
                            {
                                internalType: 'bytes32',
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'bytes32',
                                name: 's',
                                type: 'bytes32',
                            },
                            {
                                internalType: 'uint8',
                                name: 'v',
                                type: 'uint8',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.PointSigValues',
                        name: 'pointSigValues',
                        type: 'tuple',
                    },
                    {
                        internalType: 'bytes32[]',
                        name: 'txLeafNodes',
                        type: 'bytes32[]',
                    },
                    {
                        components: [
                            {
                                internalType: 'bytes[]',
                                name: 'tx_sigs',
                                type: 'bytes[]',
                            },
                            {
                                internalType: 'bytes[]',
                                name: 'packed_context_free_data',
                                type: 'bytes[]',
                            },
                            {
                                internalType: 'enum TxMrootWNS.Compression',
                                name: 'compression',
                                type: 'uint8',
                            },
                            {
                                internalType: 'bytes',
                                name: 'packed_tx',
                                type: 'bytes',
                            },
                            {
                                internalType: 'enum TxMrootWNS.Status',
                                name: 'status',
                                type: 'uint8',
                            },
                            {
                                internalType: 'uint32',
                                name: 'cpu',
                                type: 'uint32',
                            },
                            {
                                internalType: 'uint32',
                                name: 'net',
                                type: 'uint32',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.TxData',
                        name: 'wTxData',
                        type: 'tuple',
                    },
                    {
                        internalType: 'uint256',
                        name: 'wIndex',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct InitWithdrawalBlock',
                name: 'iwd',
                type: 'tuple',
            },
        ],
        name: 'initiateWithdrawal',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        name: 'initiatedWithdrawals',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_bucketAddr',
                type: 'address',
            },
        ],
        name: 'setBucketAddr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_challengeResolverAddr',
                type: 'address',
            },
        ],
        name: 'setChallengeResolverAddr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'setOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_stateAddr',
                type: 'address',
            },
        ],
        name: 'setStateAddr',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_timeLockPeriod',
                type: 'uint256',
            },
        ],
        name: 'setTimeLockPeriod',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'stateAddr',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'timeLockPeriod',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'account',
                        type: 'string',
                    },
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string',
                    },
                    {
                        components: [
                            {
                                internalType: 'string',
                                name: 'actor',
                                type: 'string',
                            },
                            {
                                internalType: 'string',
                                name: 'permission',
                                type: 'string',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.Authorization[]',
                        name: 'authorization',
                        type: 'tuple[]',
                    },
                    {
                        components: [
                            {
                                internalType: 'address',
                                name: 'contractAddress',
                                type: 'address',
                            },
                            {
                                internalType: 'uint128',
                                name: 'amountWhole',
                                type: 'uint128',
                            },
                            {
                                internalType: 'uint128',
                                name: 'amountDecimal',
                                type: 'uint128',
                            },
                            {
                                internalType: 'uint8',
                                name: 'precision',
                                type: 'uint8',
                            },
                            {
                                internalType: 'address',
                                name: 'to',
                                type: 'address',
                            },
                            {
                                internalType: 'string',
                                name: 'from',
                                type: 'string',
                            },
                        ],
                        internalType: 'struct TxMrootWNS.WithdrawActionData20',
                        name: 'data',
                        type: 'tuple',
                    },
                ],
                internalType: 'struct TxMrootWNS.WithdrawalAction20',
                name: 'action',
                type: 'tuple',
            },
            {
                internalType: 'bytes32',
                name: 'wBSD',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'wBID',
                type: 'bytes32',
            },
        ],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.default = ERC20Withdraw_ABI;
//# sourceMappingURL=erc20withdraw.abi.js.map