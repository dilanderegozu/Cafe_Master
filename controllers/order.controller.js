const utils = require("../utils/index");
const baseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");
const orderService = require("../services/index");

exports.createOrder = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    const json = await orderService.order.createOrder(req.body, req.user?.id);
    return res.status(StatusCodes.CREATED).json({
      ...baseResponse,
      data: json,
      error: false,
      success: true,
      timestamp: Date.now(),
      code: StatusCodes.CREATED,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ...baseResponse,
      message: error.message,
      success: false,
      error: true,
      timestamp: Date.now(),
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};


exports.getAllOrder = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    
    
    const json = await orderService.order.getAllOrder();
    
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

exports.getAllOrderById = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }

  
    const json = await orderService.order.getAllOrderById(
      req.params.id
    );

    return res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: json,
      success: true,
      error: false,
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

exports.deleteOrder = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    

    const json = await orderService.order.deleteOrder(
       req.params.id,
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

exports.updateOrder = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    
    
    const json = await orderService.order.updateOrder(
      req.params.id,      
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