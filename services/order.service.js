const Order = require("../models/order.model");
const utils = require("../utils/index");
const mongoose = require("mongoose");
const Stock = require("../models/stockHistory.model");
const Product = require("../models/product.model");

exports.createOrder = async (orderData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = new Order(orderData);
    await order.save({ session });

    for (const item of orderData.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Ürün bulunamadı: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Yetersiz stok! Ürün: ${product.name}, Mevcut stok: ${product.stock}, İstenen stok miktarı: ${item.quantity}`,
        );
      }
      const beforeStock = product.stock;
      const newStock = beforeStock - item.quantity;
      product.stock = newStock;
      await product.save({ session });

      const stockHistory = new Stock({
        productId: item.productId,
        changeType: "SATIŞ",
        beforeStock: beforeStock,
        changeAmount: -item.quantity,
        newStock: newStock,
        saleId: order._id,
        userId: userId,
      });
      await stockHistory.save({ session });
    }
    await session.commitTransaction();
    return await Order.findById(order._id).populate("items.productId");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.deleteOrder = async (id, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new Error("Sipariş bulunamadı");
    }

    for (const item of order.items) {
   const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error("Ürün bulunamadı");
      }
      const beforeStock = product.stock;
      const newStock = beforeStock + item.quantity;

      product.stock = newStock;
      await product.save({ session });
      await Stock.create(
        [
          {
            productId: item.productId,
            changeType: "YÜKLEME",
            beforeStock,
            changeAmount: item.quantity,
            newStock,
            saleId: order._id,
            userId,
          },
        ],
        { session },
      );
    }
    await Order.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.updateOrder = async (id, updateData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new Error("Sipariş bulunamadı");
    }
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session },
      );
    }

    for (const item of updateData.items) {
      const product = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity },
        },
        { $inc: { stock: -item.quantity } },
        { new: true, session },
      );

      if (!product) {
        throw new Error("Yetersiz stok");
      }
    }
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    });

    await session.commitTransaction();

    return updatedOrder;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getAllOrder = async () => {
  try {
    const order = await Order.find();
    return order.map((order) => ({
     id: order._id,
  tableNumber: order.tableNumber,
  items: order.items,
  subTotal: order.subTotal,
  totalDiscount: order.totalDiscount,
  finalTotal: order.finalTotal,
  orderStatus: order.orderStatus,
  paymentMethod: order.paymentMethod,
    }));
  } catch (error) {
    throw error;
  }
};

exports.getAllOrderById = async (id) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Sipariş bulunamadı");
    }
    return {
      id: order._id,
      tableNumber: order.tableNumber,
      items: order.items,
      subTotal,
      totalDiscount,
      finalTotal: order.finalTotal,
      orderStatus,
      paymentMethod,
      createdAt: order.createdAt,
    };
  } catch (error) {
    throw error;
  }
};
