const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Stokta", "Tükendi"],
    },
    discountRate: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
    minimize: true,
  },
);

const Product = mongoose.model("Product", productSchema, "product");

module.exports = Product;
