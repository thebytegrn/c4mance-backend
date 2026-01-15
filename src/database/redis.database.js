import { Redis } from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  family: 0,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

export default redisClient;
