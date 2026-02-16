const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.post("/", controller.orderController.createOrder);
router.get("/", controller.orderController.getAllOrder);
router.get("/:id", controller.orderController.getAllOrderById);
router.delete("/:id", controller.orderController.deleteOrder);
router.patch("/:id", controller.orderController.updateOrder);
module.exports = router;
