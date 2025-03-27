import Redis from "ioredis";

// Configure Redis connection with Docker settings
const redis = new Redis({
    host: process.env.REDIS_HOST || "redis", // Matches Docker service name
    port: parseInt(process.env.REDIS_PORT || "6379"),
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
});

// Handle connection events
redis
    .on("connect", () => console.log("Connected to Redis"))
    .on("error", (err) => console.error("Redis error:", err))
    .on("reconnecting", () => console.log("Reconnecting to Redis"))
    .on("end", () => console.log("Disconnected from Redis"));

export default redis;