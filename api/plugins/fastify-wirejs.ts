import {FastifyInstance, FastifyPluginOptions} from "fastify";
import fp from "fastify-plugin";
import { Api } from "../../addons/wirejs-native";

export default fp(async (fastify: FastifyInstance, options: FastifyPluginOptions): Promise<void> => {
    const rpc = fastify.manager.nodeosJsonRPC;
    const api = new Api({
        rpc,
        signatureProvider: null,
        chainId: options.chain_id,
        textDecoder: new TextDecoder(),
        textEncoder: new TextEncoder(),
    });
    fastify.decorate('wirejs', {api, rpc});
}, {
    fastify: '>=2.0.0',
    name: 'fastify-wirejs'
});
