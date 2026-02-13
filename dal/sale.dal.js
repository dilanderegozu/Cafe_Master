const Sale = require("../models/sale.model");

const SaleAccess = {
  async create(salesModel) {
    return await salesModel.save();
  },
  async updateById(id, body) {
    return await Sale.findByIdAndUpdate({ _id: id }, body);
  },
  async findOne(where) {
    return await Sale.findOne(where);
  },
  async findById(id) {
    return await Sale.findById({ _id: id });
  },
  async findOnePopulate(where, populate) {
    return await Sale.findOne(where).populate(populate);
  },
};

module.exports = SaleAccess;
