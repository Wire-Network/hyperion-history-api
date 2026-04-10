export const AbiDefinitions = {
    version: 'sysio::abi/1.1',
    structs: [
        {
            name: 'extensions_entry',
            base: '',
            fields: [
                {
                    name: 'tag',
                    type: 'uint16',
                },
                {
                    name: 'value',
                    type: 'bytes',
                },
            ],
        },
        {
            name: 'type_def',
            base: '',
            fields: [
                {
                    name: 'new_type_name',
                    type: 'string',
                },
                {
                    name: 'type',
                    type: 'string',
                },
            ],
        },
        {
            name: 'field_def',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'type',
                    type: 'string',
                },
            ],
        },
        {
            name: 'struct_def',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'base',
                    type: 'string',
                },
                {
                    name: 'fields',
                    type: 'field_def[]',
                },
            ],
        },
        {
            name: 'action_def',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'name',
                },
                {
                    name: 'type',
                    type: 'string',
                },
                {
                    name: 'ricardian_contract',
                    type: 'string',
                },
            ],
        },
        {
            // Per-secondary-index metadata embedded in table_def.
            // Mirrors sysio::chain::index_def in libraries/chain/include/sysio/chain/abi_def.hpp.
            name: 'index_def',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'key_type',
                    type: 'string',
                },
                {
                    name: 'table_id',
                    type: 'uint16',
                },
            ],
        },
        {
            // Wire-sysio table_def gained `table_id` (uint16) and `secondary_indexes`
            // in PR Wire-Network/wire-sysio#288, and `name` was widened from sysio::name
            // to a free-form string so long table names work. The binary format change
            // means old hyperion deserializers cannot parse new ABIs at all — fields
            // after `name` would be misaligned. Mirrors sysio::chain::table_def in
            // libraries/chain/include/sysio/chain/abi_def.hpp.
            name: 'table_def',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'index_type',
                    type: 'string',
                },
                {
                    name: 'key_names',
                    type: 'string[]',
                },
                {
                    name: 'key_types',
                    type: 'string[]',
                },
                {
                    name: 'type',
                    type: 'string',
                },
                {
                    name: 'table_id',
                    type: 'uint16',
                },
                {
                    name: 'secondary_indexes',
                    type: 'index_def[]',
                },
            ],
        },
        {
            name: 'clause_pair',
            base: '',
            fields: [
                {
                    name: 'id',
                    type: 'string',
                },
                {
                    name: 'body',
                    type: 'string',
                },
            ],
        },
        {
            name: 'error_message',
            base: '',
            fields: [
                {
                    name: 'error_code',
                    type: 'uint64',
                },
                {
                    name: 'error_msg',
                    type: 'string',
                },
            ],
        },
        {
            name: 'variant_def',
            base: '',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                },
                {
                    name: 'types',
                    type: 'string[]',
                },
            ],
        },
        {
            name: 'abi_def',
            base: '',
            fields: [
                {
                    name: 'version',
                    type: 'string',
                },
                {
                    name: 'types',
                    type: 'type_def[]',
                },
                {
                    name: 'structs',
                    type: 'struct_def[]',
                },
                {
                    name: 'actions',
                    type: 'action_def[]',
                },
                {
                    name: 'tables',
                    type: 'table_def[]',
                },
                {
                    name: 'ricardian_clauses',
                    type: 'clause_pair[]',
                },
                {
                    name: 'error_messages',
                    type: 'error_message[]',
                },
                {
                    name: 'abi_extensions',
                    type: 'extensions_entry[]',
                },
                {
                    name: 'variants',
                    type: 'variant_def[]$',
                },
            ],
        },
    ],
};

export const RexAbi = {
    version: 'sysio::abi/1.1',
    types: [],
    structs: [
        {
            name: 'buyresult',
            base: '',
            fields: [
                {
                    name: 'rex_received',
                    type: 'asset',
                },
            ],
        }, {
            name: 'orderresult',
            base: '',
            fields: [
                {
                    name: 'owner',
                    type: 'name',
                }, {
                    name: 'proceeds',
                    type: 'asset',
                },
            ],
        }, {
            name: 'rentresult',
            base: '',
            fields: [
                {
                    name: 'rented_tokens',
                    type: 'asset',
                },
            ],
        },
        {
            name: 'sellresult',
            base: '',
            fields: [
                {
                    name: 'proceeds',
                    type: 'asset',
                }],
        },
    ],
    actions: [
        {
            name: 'buyresult',
            type: 'buyresult',
            ricardian_contract: '',
        },
        {
            name: 'orderresult',
            type: 'orderresult',
            ricardian_contract: '',
        },
        {
            name: 'rentresult',
            type: 'rentresult',
            ricardian_contract: '',
        },
        {
            name: 'sellresult',
            type: 'sellresult',
            ricardian_contract: '',
        },
    ],
};
