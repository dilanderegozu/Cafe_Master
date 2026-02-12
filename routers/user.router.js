const express = require("express");
const router = express.Router();
const controller = require("../controllers/index");

router.post("/", controller.userController.createUser);
router.post("/login", controller.userController.signIn);
router.get("/", controller.userController.getAllUser);
router.get("/:id", controller.userController.getUser);
router.put("/:id", controller.userController.updateUser);
router.delete("/:id", controller.userController.deleteUser);
router.patch("/:id/password", controller.userController.createPassword);

module.exports = router;
