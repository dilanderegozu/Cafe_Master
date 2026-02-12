const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const saleSchema = new Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtTime: {
          type: Number,
          required: true,
        },
      },
    ],
    //indirimsiz toplam
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    //toplam indiirm
    totalDiscount: {
      type: Number,
      default: 0,
    },
    //müşterinin ödediği net tutar
    finalTotal: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Preparing", "Served", "Completed"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit Card", "Setcard"],
    },
  },
  { timestamps: true, autoIndex: true, minimize: true },
);

const Sale = mongoose.model("Sale", saleSchema, "sales");
module.exports = Sale;
