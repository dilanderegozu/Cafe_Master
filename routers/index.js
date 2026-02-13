const express = require("express");
const router = express.Router();
const userRouter = require("./user.router");
const productRouter = require("./product.router")
router.use("/user", userRouter);
router.use("/product",productRouter)


module.exports = router;
