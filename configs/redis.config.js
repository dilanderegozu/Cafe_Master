const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on("connect", () => {
  console.log("Redis bağlantısı başarılı");
});

redisClient.on("error", (err) => {
  console.log("Redis bağlantısı başarılı olamadı", err);
});

module.exports = redisClient;
