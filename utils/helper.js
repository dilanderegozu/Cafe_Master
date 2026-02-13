const md5 = require("md5");
const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const dns = require("dns");
const os = require("os");
const User = require("../models/user.model");
const logger = require("./logger")
exports.hashToPassword = (password) => {
  return md5(password);
};

exports.comparePassword = (password, hashedPassword) => {
  return md5(password) === hashedPassword;
};

exports.handleValidation = (req) => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty() === false) {
    return {
      message: "Geçersiz veri",
      success: false,
      error: true,
      validationErrors: validationErrors.array(),
      timestamp: new Date(),
      code: StatusCodes.BAD_REQUEST,
    };
  }
  return null;
};

exports.createToken = (userId, name) => {
  const token = jwt.sign({ userId, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: "localhost",
  });
  return token;
};

exports.verifyToken = (token) => {
  const isVerify = { decodedToken: null };
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return (isVerify.decodedToken = decodedToken);
  } catch (error) {
    console.log("Helperda hata var");
    throw new Error(error.message);
  }
};

exports.createUploadDir = (str) => {
  if (!fs.existsSync(str)) {
    fs.mkdirSync(str, { recursive: true });
  }
};

exports.getHost = () => {
  return new Promise((resolve) => {
    dns.lookup(os.hostname(), (err, ip) => {
      resolve(`http://${ip}:${process.env.PORT}`);
    });
  });
};

exports.logToError = (error, req, message) => {
  logger.error(
    `IP Adresi: ${req.ip} - PATH: ${req.path} - BODY: ${JSON.stringify(
      req.body,
    )} - PARAMS: ${JSON.stringify(req.params)} - QUERY: ${JSON.stringify(
      req.query,
    )} - ERROR TIME: ${Date.now()} - URL: ${req.url} - ERROR MESSAGE: ${
      error.message
    } - ERROR CALLSTACK: ${JSON.stringify(error)} - CUSTOM-INFO: ${message}`,
  );
};
