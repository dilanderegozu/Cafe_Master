const redisHelper = require("../utils/index").redisHelper;
const baseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
/**
 * @type {import("ioredis").Redis}
 */
/**
 * Cache middleware
 * @param {string} keyPrefix
 * @param {number} ttl
 */

const cacheMiddleware = (keyPrefix, ttl = 3600) => {
  return async (req, res, next) => {
    try {
      const cacheKey = req.params.id
        ? `${keyPrefix}:${req.params.id}`
        : `${keyPrefix}:all`;
      const cachedData = await redisHelper.get(cacheKey);

      if (cachedData) {
        console.log(`Cache başarılı: ${cacheKey}`);
        return res.status(StatusCodes.OK).json({
          ...baseResponse,
          data: cachedData,
          error: false,
          success: true,
          timestamp: Date.now(),
          code: StatusCodes.OK,
          fromCache: true,
        });
      }
      console.log(`Cache başarısız: ${cacheKey}`);
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (body.success && body.data) {
          redisHelper.set(cacheKey, body.data, ttl);
        }
        return originalJson(body);
      };
      next()
    } catch (error) {
      console.log("Cache middleware hatası:", error);
      next();
    }
  };
};

module.exports = cacheMiddleware;
