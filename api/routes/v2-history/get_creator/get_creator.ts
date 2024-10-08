import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {timedQuery} from "../../../helpers/functions";

async function getCreator(fastify: FastifyInstance, request: FastifyRequest) {

    const query: any = request.query;

    const response = {
        account: query.account,
        creator: '',
        timestamp: '',
        block_num: 0,
        trx_id: '',
    };

    if (query.account === fastify.manager.config.settings.sysio_alias) {
        try {
            const genesisBlock = await fastify.wirejs.rpc.get_block(1);
            if (genesisBlock) {
                response.timestamp = genesisBlock.timestamp;
            }
        } catch (e) {
            console.log(e.message);
        }
        response.creator = '__self__';
        response.block_num = 1;
        response.trx_id = "";
        return response;
    }

    const results = await fastify.elastic.search({
        "index": fastify.manager.chain + '-action-*',
        "body": {
            size: 1,
            query: {
                bool: {
                    must: [{term: {"@newaccount.newact": query.account}}]
                }
            }
        }
    });

    if (results['body']['hits']['hits'].length === 1) {
        const result = results['body']['hits']['hits'][0]._source;
        response.trx_id = result.trx_id;
        response.block_num = result.block_num;
        response.creator = result.act.data.creator;
        response.timestamp = result['@timestamp'];
        return response;
    } else {
        let accountInfo;
        try {
            accountInfo = await fastify.wirejs.rpc.get_account(query.account);
        } catch (e) {
            throw new Error("account not found");
        }
        if (accountInfo) {
            try {
                response.timestamp = accountInfo.created;
                const blockHeader = await fastify.elastic.search({
                    "index": fastify.manager.chain + '-block-*',
                    "body": {
                        size: 1,
                        query: {
                            bool: {
                                must: [{term: {"@timestamp": response.timestamp}}]
                            }
                        }
                    }
                });
                const hits = blockHeader['body']['hits']['hits'];
                if (hits.length > 0 && hits[0]._source) {
                    const blockId = blockHeader['body']['hits']['hits'][0]._source.block_id;
                    const blockData = await fastify.wirejs.rpc.get_block(blockId);
                    response.block_num = blockData.block_num;
                    for (const transaction of blockData["transactions"]) {
                        if (typeof transaction.trx !== 'string') {
                            const actions = transaction.trx.transaction.actions;
                            for (const act of actions) {
                                if (act.name === 'newaccount') {
                                    if (act.data.name === query.account) {
                                        response.creator = act.data.creator;
                                        response.trx_id = transaction.trx.id ? transaction.trx.id : (transaction as any)?.id;
                                        return response;
                                    }
                                }
                            }
                        }
                    }
                }
                return response;
            } catch (e) {
                console.log(e.message);
                throw new Error("account creation not found");
            }
        } else {
            throw new Error("account not found");
        }
    }
}

export function getCreatorHandler(fastify: FastifyInstance, route: string) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        reply.send(await timedQuery(getCreator, fastify, request, route));
    }
}
