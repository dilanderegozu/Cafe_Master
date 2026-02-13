const utils = require("../utils/index");
const baseResponse = require("../dto/baseResponse.dto");
const { StatusCodes } = require("http-status-codes");
const productService = require("../services/index");

exports.createProduct = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    
    const json = await productService.product.createProduct(
      req.body,           
      req.user?.id       
    );
    
    return res.status(StatusCodes.CREATED).json({
      ...baseResponse,
      data: json,
      error: false,
      success: true,
      timestamp: Date.now(),
      code: StatusCodes.CREATED,
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

exports.getAllProduct = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    
    
    const json = await productService.product.getAllProduct();
    
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

exports.getProductById = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }

  
    const product = await productService.product.getProductById(
      req.params.id
    );

    return res.status(StatusCodes.OK).json({
      ...baseResponse,
      data: product,
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

exports.deleteProductById = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    

    const json = await productService.product.deleteProductById(
      req.params.id
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

exports.updateProduct = async (req, res) => {
  try {
    const isInvalid = utils.helper.handleValidation(req);
    if (isInvalid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...baseResponse,
        ...isInvalid,
      });
    }
    
    
    const json = await productService.product.updateProduct(
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