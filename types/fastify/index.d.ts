import {Client} from "@elastic/elasticsearch";
import {ConnectionManager} from "../../connections/manager.class";
import {Api, JsonRpc} from "../../addons/wirejs";
import {CacheManager} from "../../api/helpers/cacheManager";
import {FastifyRedis} from "@fastify/redis";

declare module 'fastify' {
    export interface FastifyInstance {
        manager: ConnectionManager;
        cacheManager: CacheManager;
        redis: FastifyRedis;
        elastic: Client;
        wirejs: {
            rpc: JsonRpc;
            api: Api;
        };
        chain_api: string;
        push_api: string;
        tokenCache: Map<string, any>;
        allowedActionQueryParamSet: Set<string>;
        routeSet: Set<string>;
    }
}
