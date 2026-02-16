const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.post("/", controller.paymentController.payOrder);
module.exports = router