// import { Redis } from 'ioredis';

// const redisInstance = new Redis({
//     password: process.env.REDIS_PASSWORD
// })

// export default redisInstance;
import Redis from "ioredis";

const redisInstance = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1", // fallback for local dev
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined // if Render gives you rediss://
});

// Always attach an error handler
redisInstance.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

export default redisInstance;
