const helper = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const consts = require("../consts/index");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = (req, res, next) => {
  try {
    const publicRoutes = ["/api/user/login", "/api/user/"];
    if (
      publicRoutes.some((route) => {
        req.url.startsWith(route);
      })
    ) {
      return next();
    }
    const authHeader = req.headers.authorization
    if(!authHeader?.startsWith('Bearer')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message:"Token bulunamadı"
        })
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = helper.helper.verifyToken(token);

    if (!decodedToken?.decodedToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: consts.auth.auth.UNAUTHORIZATION_MESSAGE
      });
    }

    req.user = decodedToken;
    next();

    
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).send({
      message: consts.auth.auth.UNAUTHORIZATION_MESSAGE,
    });
  }
};
