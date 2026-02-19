const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");
const cacheMiddleware = require("../middlewares/cache.middleware");

router.post("/", controller.productController.createProduct);
router.get("/", controller.productController.getAllProduct);
router.get("/:id", controller.productController.getProductById);
router.delete("/:id", controller.productController.deleteProductById);
router.patch("/:id", controller.productController.updateProduct);
module.exports = router;
