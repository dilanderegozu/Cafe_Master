const logger = require("../utils/index");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import ("express").NextFunction} next
 */
module.exports = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.logger.info(
      `IP: ${req.ip} | 
       METHOD: ${req.method} | 
       PATH: ${req.originalUrl} | 
       STATUS: ${res.statusCode} | 
       DURATION: ${duration}ms`
    );
  });

  next();
};