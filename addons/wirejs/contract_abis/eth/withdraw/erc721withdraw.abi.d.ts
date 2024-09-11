declare const ERC721Withdraw_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_timeLockPeriod";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "_stateAddr";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_bucketAddr";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newBucketAddr";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "oldBucketAddr";
        readonly type: "address";
    }];
    readonly name: "BucketAddressChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newChallengeResolver";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "oldChallengeResolver";
        readonly type: "address";
    }];
    readonly name: "ChallengeResolverChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "actor";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "contractAddress";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "tokenId";
        readonly type: "uint64";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "timeLock";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "bSD";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "bID";
        readonly type: "bytes32";
    }];
    readonly name: "InitiatedWithdrawal";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "oldOwner";
        readonly type: "address";
    }];
    readonly name: "OwnerChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newStateAddr";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "oldStateAddr";
        readonly type: "address";
    }];
    readonly name: "StateAddressChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "newTimeLockPeriod";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "oldTimeLockPeriod";
        readonly type: "uint256";
    }];
    readonly name: "TimeLockPeriodChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "actor";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "contractAddress";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "tokenId";
        readonly type: "uint64";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "key";
        readonly type: "bytes32";
    }];
    readonly name: "Withdrawal";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "bucketAddr";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "challengeResolverAddr";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "string";
            readonly name: "account";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "actor";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "permission";
                readonly type: "string";
            }];
            readonly internalType: "struct TxMrootWNS.Authorization[]";
            readonly name: "authorization";
            readonly type: "tuple[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "contractAddress";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "tokenId";
                readonly type: "uint64";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "string";
                readonly name: "from";
                readonly type: "string";
            }];
            readonly internalType: "struct TxMrootWNS.WithdrawActionData721";
            readonly name: "data";
            readonly type: "tuple";
        }];
        readonly internalType: "struct TxMrootWNS.WithdrawalAction721";
        readonly name: "action";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly components: readonly [{
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
            readonly internalType: "struct Header.BlockTest";
            readonly name: "header";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "signer";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }];
            readonly internalType: "struct TxMrootWNS.PointSigValues";
            readonly name: "pointSigValues";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32[]";
            readonly name: "txLeafNodes";
            readonly type: "bytes32[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "bytes[]";
                readonly name: "tx_sigs";
                readonly type: "bytes[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "packed_context_free_data";
                readonly type: "bytes[]";
            }, {
                readonly internalType: "enum TxMrootWNS.Compression";
                readonly name: "compression";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "packed_tx";
                readonly type: "bytes";
            }, {
                readonly internalType: "enum TxMrootWNS.Status";
                readonly name: "status";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint32";
                readonly name: "cpu";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "net";
                readonly type: "uint32";
            }];
            readonly internalType: "struct TxMrootWNS.TxData";
            readonly name: "wTxData";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256";
            readonly name: "wIndex";
            readonly type: "uint256";
        }];
        readonly internalType: "struct InitWithdrawalBlock";
        readonly name: "iwd";
        readonly type: "tuple";
    }];
    readonly name: "getKey";
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
            readonly internalType: "string";
            readonly name: "account";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "actor";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "permission";
                readonly type: "string";
            }];
            readonly internalType: "struct TxMrootWNS.Authorization[]";
            readonly name: "authorization";
            readonly type: "tuple[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "contractAddress";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "tokenId";
                readonly type: "uint64";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "string";
                readonly name: "from";
                readonly type: "string";
            }];
            readonly internalType: "struct TxMrootWNS.WithdrawActionData721";
            readonly name: "data";
            readonly type: "tuple";
        }];
        readonly internalType: "struct TxMrootWNS.WithdrawalAction721";
        readonly name: "action";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly components: readonly [{
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
            readonly internalType: "struct Header.BlockTest";
            readonly name: "header";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "signer";
                readonly type: "address";
            }, {
                readonly internalType: "bytes32";
                readonly name: "r";
                readonly type: "bytes32";
            }, {
                readonly internalType: "bytes32";
                readonly name: "s";
                readonly type: "bytes32";
            }, {
                readonly internalType: "uint8";
                readonly name: "v";
                readonly type: "uint8";
            }];
            readonly internalType: "struct TxMrootWNS.PointSigValues";
            readonly name: "pointSigValues";
            readonly type: "tuple";
        }, {
            readonly internalType: "bytes32[]";
            readonly name: "txLeafNodes";
            readonly type: "bytes32[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "bytes[]";
                readonly name: "tx_sigs";
                readonly type: "bytes[]";
            }, {
                readonly internalType: "bytes[]";
                readonly name: "packed_context_free_data";
                readonly type: "bytes[]";
            }, {
                readonly internalType: "enum TxMrootWNS.Compression";
                readonly name: "compression";
                readonly type: "uint8";
            }, {
                readonly internalType: "bytes";
                readonly name: "packed_tx";
                readonly type: "bytes";
            }, {
                readonly internalType: "enum TxMrootWNS.Status";
                readonly name: "status";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint32";
                readonly name: "cpu";
                readonly type: "uint32";
            }, {
                readonly internalType: "uint32";
                readonly name: "net";
                readonly type: "uint32";
            }];
            readonly internalType: "struct TxMrootWNS.TxData";
            readonly name: "wTxData";
            readonly type: "tuple";
        }, {
            readonly internalType: "uint256";
            readonly name: "wIndex";
            readonly type: "uint256";
        }];
        readonly internalType: "struct InitWithdrawalBlock";
        readonly name: "iwd";
        readonly type: "tuple";
    }];
    readonly name: "initiateWithdrawal";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly name: "initiatedWithdrawals";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_bucketAddr";
        readonly type: "address";
    }];
    readonly name: "setBucketAddr";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_challengeResolverAddr";
        readonly type: "address";
    }];
    readonly name: "setChallengeResolverAddr";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_owner";
        readonly type: "address";
    }];
    readonly name: "setOwner";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_stateAddr";
        readonly type: "address";
    }];
    readonly name: "setStateAddr";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_timeLockPeriod";
        readonly type: "uint256";
    }];
    readonly name: "setTimeLockPeriod";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "stateAddr";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "timeLockPeriod";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "string";
            readonly name: "account";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "actor";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "permission";
                readonly type: "string";
            }];
            readonly internalType: "struct TxMrootWNS.Authorization[]";
            readonly name: "authorization";
            readonly type: "tuple[]";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "contractAddress";
                readonly type: "address";
            }, {
                readonly internalType: "uint64";
                readonly name: "tokenId";
                readonly type: "uint64";
            }, {
                readonly internalType: "address";
                readonly name: "to";
                readonly type: "address";
            }, {
                readonly internalType: "string";
                readonly name: "from";
                readonly type: "string";
            }];
            readonly internalType: "struct TxMrootWNS.WithdrawActionData721";
            readonly name: "data";
            readonly type: "tuple";
        }];
        readonly internalType: "struct TxMrootWNS.WithdrawalAction721";
        readonly name: "action";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes32";
        readonly name: "wBSD";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "wBID";
        readonly type: "bytes32";
    }];
    readonly name: "withdraw";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export default ERC721Withdraw_ABI;
