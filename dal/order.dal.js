const Order = require("../models/order.model");

const orderAccess = {
  async create(ordersmodel) {
    return await ordersmodel.save();
  },
  async updateById(id, body) {
    return await Order.findByIdAndUpdate({ _id: id }, body);
  },
  async findOne(where) {
    return await Order.findOne(where);
  },
  async findById(id) {
    return await Order.findById({ _id: id });
  },
  async findOnePopulate(where, populate) {
    return await Order.findOne(where).populate(populate);
  },
};

module.exports = orderAccess;
