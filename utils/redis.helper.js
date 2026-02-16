const redisClient = require("../configs/redis.config");

class RedisHelper {
  /**
   * Cache'e veri kaydet
   * @param {string} key
   * @param {any} value
   * @param {number} ttl --geçerlilik süresi
   */

  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setex(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.log("Redis SET hatası:", error);
      return false;
    }
  }

  /**
   * Cache veri okuma
   * @param {string} key
   */

  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Redis GET hatası:", error);
      return null;
    }
  }
  /**
   * Cache veri silme
   * @param {string} key
   */

  async delete(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error("Redis DELETE hatası:", error);
      return false;
    }
  }

  /**
   * Modelse göre tüm anahtarları sil
   * @param {string} pattern
   */

  async deletePattern(pattern) {
    try {
      const data = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...data);
      }
      return true;
    } catch (error) {
      console.log("Redis DELETE Pattern hatası:", error);
    }
  }
   /**
   * Cache'in var mı yok mu
   * @param {string} key 
   */
  async exists(key) {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Redis EXISTS hatası:", error);
      return false;
    }
  }
}

module.exports = new RedisHelper()

