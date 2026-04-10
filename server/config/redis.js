import { Redis } from "@upstash/redis";

const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.REDIS_TOKEN || process.env.UPSTASH_REDIS_TOKEN;

if (!redisUrl || !redisToken) {
  console.error(
    "Missing Redis environment variables. Please set REDIS_URL and REDIS_TOKEN.",
  );
}

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

const testConnection = async () => {
  try {
    await redis.set("connection-test", "ok");
    const result = await redis.get("connection-test");
    if (result === "ok") {
      console.log("Redis connected successfully");
    }
  } catch (error) {
    console.error("Redis connection failed:", error.message);
  }
};

testConnection();

export default redis;
