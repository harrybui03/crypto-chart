import Redis from "ioredis";
import {config} from "../config/env";
import {ERROR_MESSAGES} from "../constant/error";

const redis = new Redis(config.redis.url, {
    tls: {
        rejectUnauthorized: false
    }
});

redis
    .on("connect", () => console.log("Connected to Redis"))
    .on("error", (err) => console.error("Redis error:", err))
    .on("reconnecting", () => console.log("Reconnecting to Redis"))
    .on("end", () => console.log("Disconnected from Redis"));

export const redisClient = {
    getClient: () => {
        if (!redis) {
            throw new Error(ERROR_MESSAGES.CACHE.CONNECTION_FAILED);
        }
        return redis;
    },
    isConnected: () => !!redis?.status,
    quit: async () => {
        if (redis) {
            await redis.quit();
        }
    }
};

export type RedisClient = typeof redisClient;