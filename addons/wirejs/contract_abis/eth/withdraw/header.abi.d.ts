declare const Header_ABI: readonly [{
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "_timestamp";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "_producer";
            readonly type: "string";
        }, {
            readonly internalType: "uint16";
            readonly name: "_confirmed";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_previous";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_txMroot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_actMroot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint32";
            readonly name: "_scheduleVersion";
            readonly type: "uint32";
        }];
        readonly internalType: "struct Header.BlockHeader";
        readonly name: "b";
        readonly type: "tuple";
    }];
    readonly name: "calculateId";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "_timestamp";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "_producer";
            readonly type: "string";
        }, {
            readonly internalType: "uint16";
            readonly name: "_confirmed";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_previous";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_txMroot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_actMroot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint32";
            readonly name: "_scheduleVersion";
            readonly type: "uint32";
        }];
        readonly internalType: "struct Header.BlockHeader";
        readonly name: "header";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_blockMroot";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "_scheduleHash";
        readonly type: "bytes32";
    }];
    readonly name: "createSignatureDigest";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "sigDigest";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "blockID";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "id";
        readonly type: "bytes32";
    }];
    readonly name: "numFromId";
    readonly outputs: readonly [{
        readonly internalType: "uint32";
        readonly name: "";
        readonly type: "uint32";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bool";
        readonly name: "ext";
        readonly type: "bool";
    }];
    readonly name: "serializeExtensions";
    readonly outputs: readonly [{
        readonly internalType: "bytes1";
        readonly name: "";
        readonly type: "bytes1";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "_timestamp";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "_producer";
            readonly type: "string";
        }, {
            readonly internalType: "uint16";
            readonly name: "_confirmed";
            readonly type: "uint16";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_previous";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_txMroot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_actMroot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint32";
            readonly name: "_scheduleVersion";
            readonly type: "uint32";
        }];
        readonly internalType: "struct Header.BlockHeader";
        readonly name: "header";
        readonly type: "tuple";
    }];
    readonly name: "serializeHeader";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }];
    readonly name: "serializeName";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bool";
        readonly name: "prod";
        readonly type: "bool";
    }];
    readonly name: "serializeNewProds";
    readonly outputs: readonly [{
        readonly internalType: "bytes1";
        readonly name: "";
        readonly type: "bytes1";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "timestamp";
        readonly type: "uint256";
    }];
    readonly name: "serializeTimestamp";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint16";
        readonly name: "value";
        readonly type: "uint16";
    }];
    readonly name: "serializeUint16";
    readonly outputs: readonly [{
        readonly internalType: "bytes2";
        readonly name: "";
        readonly type: "bytes2";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint32";
        readonly name: "value";
        readonly type: "uint32";
    }];
    readonly name: "serializeUint32";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint32";
        readonly name: "value";
        readonly type: "uint32";
    }];
    readonly name: "toLittleEndian32";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}];
export default Header_ABI;
