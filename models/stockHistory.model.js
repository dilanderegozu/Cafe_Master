const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockHistorySchema = new Schema({
   productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
  changeType: {
    type: String,
    enum: ["ÜRÜN EKLEME", "SATIŞ", "DÜZELTME", "ZAYİ", "İADE"],
  },
  beforeStock: {
    type: Number,
    required: true,
  },

  changeAmount: {
    type: Number,
    required: true,
  },

  newStock: {
    type: Number,
    required: true,
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sale",
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
},{
  timestamps: true,
    autoIndex: true,
    minimize: true,
});

const Stock = mongoose.model("StockHistorySchema",stockHistorySchema,"stockHistorySchema")
module.exports= Stock