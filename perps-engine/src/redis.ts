import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not configured");
}

export const redis = createClient({
  url: redisUrl,
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error);
});