import { createClient } from "redis";

export const redisConnectionOption = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {};

export const connectRedis = async () => {
  try {
    const client = createClient(redisConnectionOption);

    client.on("error", (err) => {
      console.log("Redis client error:\n", err);
    });

    await client.connect();
    console.log("Redis connected!");

    return client;
  } catch (error) {
    console.log("Redis connection error:\n", error);
    throw error;
  }
};
