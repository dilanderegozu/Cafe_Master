const utils = require("../utils/index");
const baseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");
const paymentService = require("../services/index");

exports.payOrder = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    
    const json = await paymentService.payment.payOrder(
      req.params.orderId,
      req.body,
      req.user?.id
    );
    
    return res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: json,
      error: false,
      success: true,
      timestamp: Date.now(),
      code: StatusCodes.OK,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ...baseResponse,
      message: error.message,
      success: false,
      error: true,
      timestamp: Date.now(),
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};