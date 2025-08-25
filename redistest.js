import redis from "./app/config/redis.js"; // adjust import if needed

async function testRedis() {
  try {
    await redis.set("testKey", "HelloRedis");
    const value = await redis.get("testKey");
    console.log("✅ Redis SET/GET successful:", value);
  } catch (err) {
    console.error("❌ Redis Test Error:", err);
  } finally {
    redis.disconnect();
  }
}

testRedis();

