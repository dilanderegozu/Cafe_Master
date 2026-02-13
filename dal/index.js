const userDal = require("./user.dal");
const productDal= require("./product.dal")
const saleDal= require("./sale.dal")
module.exports = {
  user: userDal,
  product:productDal,
  sale:saleDal
};
