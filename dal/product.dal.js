const Product = require("../models/product.model");

const ProductDataAccess = {
  async create(productModels) {
    return await productModels.save();
  },
  async updateById(id, body) {
    return await Product.findByIdAndUpdate({ _id: id }, body);
  },
  async findOne(where) {
    return await Product.findOne(where);
  },
  async findById(id) {
    return await Product.findById({ _id: id });
  },
  async findOnePopulate(where, populate) {
    return await Product.findOne(where).populate(populate);
  },
};

module.exports = ProductDataAccess;
