import Redis from "ioredis";
import "dotenv/config";

const REDIS_URL = process.env.REDIS_URL || "";
const redis = new Redis(REDIS_URL, {
    tls: {
        rejectUnauthorized: false
    },
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
});

redis
    .on("connect", () => console.log("Connected to Redis"))
    .on("error", (err) => console.error("Redis error:", err))
    .on("reconnecting", () => console.log("Reconnecting to Redis"))
    .on("end", () => console.log("Disconnected from Redis"));

export default redis;