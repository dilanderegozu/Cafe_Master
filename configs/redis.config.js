const Redis = require("ioredis");

/** @type {import("ioredis").Redis} */
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 200);
    return delay;
  },
});

redisClient.on("connect", () => {
  console.log("Redis bağlantısı başarılı");
});

redisClient.on("error", (err) => {
  console.log("Redis bağlantısı başarılı olamadı", err);
});
module.exports = redisClient;
