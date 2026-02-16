const express = require("express");
const router = express.Router();

const userRouter = require("./user.router");
const productRouter = require("./product.router")
const orderRouter = require("./order.router")
const paymentRouter = require("./payment.router")


router.use("/user", userRouter);
router.use("/product",productRouter)
router.use("/order",orderRouter)
router.use("/payment",paymentRouter)

module.exports = router;
