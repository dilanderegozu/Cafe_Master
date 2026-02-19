const Order = require("../models/order.model");
const utils = require("../utils/index");
const mongoose = require("mongoose");
const Stock = require("../models/stockHistory.model");
const Product = require("../models/product.model");
const { getIO } = require("../configs/socket.config");

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

      if (newStock <= 10) {
        const io = getIO();
        io.to("admin").emit("Stok uyarısı", {
          productId: product._id,
          productName: product.name,
          currentStock: newStock,
          timestamp: new Date(),
        });
      }
    }
    await session.commitTransaction();
    await utils.redisHelper.delete("orders:all");
    await utils.redisHelper.delete("orders:active");

    const io = getIO();
    io.to("kitchen").emit("yeni sipariş", {
      orderId: order._id,
      tableNumber: order.tableNumber,
      items: order.items,
      timestamp: new Date(),
    });
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
            changeType: "SATIŞ",
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

    await utils.redisHelper.delete(`orders:${id}`);
    await utils.redisHelper.delete("orders:all");
    await utils.redisHelper.delete("orders:active");

    const io = getIO();
    io.to("kitchen").emit("Sipariş İptali", {
      orderId: order._id,
      tableNumber: order.tableNumber,
      timestamp: new Date(),
    });

    return { message: "Sipariş başarıyla iptal edildi", order };
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
    const previousStatus = order.orderStatus;
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

    await utils.redisHelper.delete(`orders:${id}`);
    await utils.redisHelper.delete("orders:all");
    await utils.redisHelper.delete("orders:active");

    const io = getIO();
    if (updateData.orderStatus && updateData.orderStatus !== previousStatus) {
      io.to("kitchen").emit("Sipariş durumu değişti", {
        orderId: updatedOrder._id,
        tableNumber: updatedOrder.tableNumber,
        status: updatedOrder.orderStatus,
      });
    }
    utils.logger.info("Sipariş güncellendi", {
      orderId: id,
      previousStatus,
      newStatus: updatedOrder.orderStatus,
    });
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
  const cachedOrders = await utils.redisHelper.get("orders:all");
    if (cachedOrders) {
      console.log(" Cache HIT: orders:all");
      return cachedOrders;
    }

    console.log(" Cache MISS: orders:all");

    const orders = await Order.find();
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      tableNumber: order.tableNumber,
      items: order.items,
      subTotal: order.subTotal,
      totalDiscount: order.totalDiscount,
      finalTotal: order.finalTotal,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    }));


    await utils.redisHelper.set("orders:all", formattedOrders, 600);

    return formattedOrders;
  } catch (error) {
    throw error;
  }
};

exports.getAllOrderById = async (id) => {
  try {

    const cacheKey = `orders:${id}`;
    const cachedOrder = await utils.redisHelper.get(cacheKey);
    if (cachedOrder) {
      console.log(` Cache HIT: ${cacheKey}`);
      return cachedOrder;
    }

    console.log(` Cache MISS: ${cacheKey}`);

    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Sipariş bulunamadı");
    }

    const formattedOrder = {
      id: order._id,
      tableNumber: order.tableNumber,
      items: order.items,
      subTotal: order.subTotal,
      totalDiscount: order.totalDiscount,
      finalTotal: order.finalTotal,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
    };


    await utils.redisHelper.set(cacheKey, formattedOrder, 600);

    return formattedOrder;
  } catch (error) {
    throw error;
  }
};