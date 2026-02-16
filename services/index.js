const userService = require("./user.service");
const productService = require("./product.service");
const orderService = require("./order.service");
const paymentService = require("./payment.service");
module.exports = {
  user: userService,
  product: productService,
  order:orderService,
  payment:paymentService,
};
