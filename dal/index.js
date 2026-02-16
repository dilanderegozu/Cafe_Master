const userDal = require("./user.dal");
const productDal= require("./product.dal")
const orderDal= require("./order.dal")
module.exports = {
  user: userDal,
  product:productDal,
  order:orderDal
};
