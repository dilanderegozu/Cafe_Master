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
          paymentStatus: "PAID" 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$amount" } 
        } 
      },
    ]).session(session);

    const alreadyPaid = totalPaid.length > 0 ? totalPaid[0].total : 0;
    const remainingAmount = order.finalTotal - alreadyPaid;


    if (paymentData.amount > remainingAmount) {
      throw new Error(
        `Ödeme tutarı kalan tutarı aşıyor. Kalan tutar: ${remainingAmount} TL`
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
      { session }
    );

    const newTotal = alreadyPaid + paymentData.amount;
    const isFullyPaid = newTotal === order.finalTotal;


    if (isFullyPaid) {
      order.orderStatus = "Completed";
      await order.save({ session });
    }

    await session.commitTransaction();

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