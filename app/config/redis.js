// import { Redis } from 'ioredis';

// const redisInstance = new Redis({
//     password: process.env.REDIS_PASSWORD
// })

// export default redisInstance;

// v2 
// import Redis from "ioredis";

// const redisInstance = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1", // fallback for local dev
//   port: process.env.REDIS_PORT || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
//   tls: process.env.REDIS_TLS === "true" ? {} : undefined // if Render gives you rediss://
// });

// // Always attach an error handler
// redisInstance.on("error", (err) => {
//   console.error("Redis Client Error:", err);
// });

// export default redisInstance;


// v3 
// import Redis from "ioredis";

// const redisInstance = new Redis({
//   host: process.env.REDIS_HOST,       // redis-13975.c91.us-east-1-3.ec2.redns.redis-cloud.com
//   port: process.env.REDIS_PORT,       // 13975
//   username: "default",                // 🔑 REQUIRED for Redis Cloud
//   password: process.env.REDIS_PASSWORD,
//   tls: {
//     rejectUnauthorized: false         // helps avoid SSL cert mismatch
//   }
// });

// // Debug connection events
// redisInstance.on("connect", () => {
//   console.log("✅ Connected to Redis Cloud");
// });

// redisInstance.on("error", (err) => {
//   console.error("❌ Redis Client Error:", err);
// });

// export default redisInstance;


import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'TYVClOOKHmWg8vJgwf5EauQgUYQyYjcB',
    socket: {
        host: 'redis-13975.c91.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 13975
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

export default client;