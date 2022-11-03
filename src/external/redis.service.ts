import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient } from "redis";
import { keys } from "src/keys";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    public readonly client = createClient({ url: keys.REDIS_URL });

    async onModuleInit() {
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.disconnect();
    }
}
