"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Header_ABI = [
    {
        inputs: [
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
                name: 'b',
                type: 'tuple',
            },
        ],
        name: 'calculateId',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
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
        name: 'createSignatureDigest',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'sigDigest',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 'blockID',
                type: 'bytes32',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'numFromId',
        outputs: [
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: 'ext',
                type: 'bool',
            },
        ],
        name: 'serializeExtensions',
        outputs: [
            {
                internalType: 'bytes1',
                name: '',
                type: 'bytes1',
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
        ],
        name: 'serializeHeader',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
        ],
        name: 'serializeName',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bool',
                name: 'prod',
                type: 'bool',
            },
        ],
        name: 'serializeNewProds',
        outputs: [
            {
                internalType: 'bytes1',
                name: '',
                type: 'bytes1',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
        ],
        name: 'serializeTimestamp',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: 'value',
                type: 'uint16',
            },
        ],
        name: 'serializeUint16',
        outputs: [
            {
                internalType: 'bytes2',
                name: '',
                type: 'bytes2',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint32',
                name: 'value',
                type: 'uint32',
            },
        ],
        name: 'serializeUint32',
        outputs: [
            {
                internalType: 'bytes4',
                name: '',
                type: 'bytes4',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint32',
                name: 'value',
                type: 'uint32',
            },
        ],
        name: 'toLittleEndian32',
        outputs: [
            {
                internalType: 'bytes4',
                name: '',
                type: 'bytes4',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
];
exports.default = Header_ABI;
//# sourceMappingURL=header.abi.js.map