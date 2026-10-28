import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
}

export const redis = createClient({
    url: redisUrl,
});

redis.on("error", (error) => {
    console.error("Redis error:", error);
});


let connectionPromise: ReturnType<typeof redis.connect> | undefined;


export async function connectRedis() {
    if (redis.isReady) {
        return;
    }

    if (!connectionPromise) {
        connectionPromise = redis.connect()
    }

    try {
        await connectionPromise;
    } finally {
        connectionPromise = undefined;
    }
}