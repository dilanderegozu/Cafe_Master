const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

exports.payOrder = async (orderId, paymentData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error("Geçerli bir ödeme tutarı giriniz");
    }

    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Sipariş bulunamadı");
    }

    if (order.orderStatus === "Completed") {
      throw new Error("Sipariş zaten kapatılmış");
    }

    const totalPaid = await Payment.aggregate([
      {
        $match: {
          orderId: new mongoose.Types.ObjectId(orderId),
          paymentStatus: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]).session(session);

    const alreadyPaid = totalPaid.length > 0 ? totalPaid[0].total : 0;
    const remainingAmount = order.finalTotal - alreadyPaid;

    if (paymentData.amount > remainingAmount) {
      throw new Error(
        `Ödeme tutarı kalan tutarı aşıyor. Kalan tutar: ${remainingAmount} TL`,
      );
    }

    const [payment] = await Payment.create(
      [
        {
          orderId,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          paymentStatus: "PAID",
          receivedBy: userId,
        },
      ],
      { session },
    );

    const newTotal = alreadyPaid + paymentData.amount;
    const isFullyPaid = newTotal === order.finalTotal;

    if (isFullyPaid) {
      order.orderStatus = "Completed";
      await order.save({ session });
    }

    await session.commitTransaction();

    await utils.redisHelper.delete(`orders:${orderId}`);
    await utils.redisHelper.delete("orders:all");
    await utils.redisHelper.delete("orders:active");
    await utils.redisHelper.delete(`payments:order:${orderId}`);

    //  Socket.io bildirimleri
    const io = getIO();

    // Kasaya ödeme bildirimi
    io.to("cashier").emit("Ödeme tamamlandı", {
      orderId: order._id,
      tableNumber: order.tableNumber,
      amount: paymentData.amount,
      method: paymentData.paymentMethod,
      isFullyPaid,
      timestamp: new Date(),
    });

    utils.logger.info("Ödeme alındı", {
      orderId,
      amount: paymentData.amount,
      isFullyPaid,
    });

    return {
      success: true,
      message: isFullyPaid
        ? "Ödeme tamamlandı, sipariş kapatıldı"
        : "Kısmi ödeme alındı",
      payment: {
        id: payment._id,
        amount: payment.amount,
        method: payment.paymentMethod,
      },
      order: {
        id: order._id,
        totalAmount: order.finalTotal,
        paidAmount: newTotal,
        remainingAmount: order.finalTotal - newTotal,
        status: order.orderStatus,
        isFullyPaid,
      },
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

exports.getPaymentsByOrder = async (orderId) => {
  try {
    const cacheKey = `payments:order:${orderId}`;
    const cachedPayments = await utils.redisHelper.get(cacheKey);
    if (cachedPayments) {
      console.log(` Cache HIT: ${cacheKey}`);
      return cachedPayments;
    }

    console.log(` Cache MISS: ${cacheKey}`);

    const payments = await Payment.find({ orderId }).populate(
      "receivedBy",
      "name email",
    );

    await utils.redisHelper.set(cacheKey, payments, 300);

    return payments;
  } catch (error) {
    throw error;
  }
};
