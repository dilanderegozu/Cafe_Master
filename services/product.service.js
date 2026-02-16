const Product = require("../models/product.model");
const utils = require("../utils/index");
const Stock = require("../models/stockHistory.model");
const mongoose = require("mongoose");

exports.createProduct = async (productData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = new Product(productData);
    await product.save({ session });

    await Stock.create(
      [
        {
          productId: product._id,
          changeType: "ÜRÜN EKLEME",
          beforeStock: 0,
          changeAmount: product.stock,
          newStock: product.stock,
           userId: userId ,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    utils.logger.info("Product created", {
      productId: product._id,
      name: product.name,
    });

    return product;
  } catch (error) {
    await session.abortTransaction();
  throw error;
  } finally {
    session.endSession(); 
  }
};

exports.getAllProduct = async () => {
  try {
    const products = await Product.find(); 
    return products.map((product) => ({
      id: product._id, 
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};

exports.getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Ürün bulunamadı");
    }
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock, 
      createdAt: product.createdAt,
    };
  } catch (error) {
   throw error;
  }
};

exports.deleteProductById = async (id) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findByIdAndDelete(id, { session });
    if (!product) {
      throw new Error("Ürün Bulunamadı");
    }

    await Stock.deleteMany({ productId: id }, { session });
    await session.commitTransaction();
    return product;
  } catch (error) {
    await session.abortTransaction();
   throw error;
  } finally {
    session.endSession(); 
  }
};

exports.updateProduct = async (id, updateData, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.findOne({
      _id: id,
      deletedAt: null,
    }).session(session);

    if (!product) {
      throw new Error("Ürün bulunamadı");
    }

   
    if (updateData.stock !== undefined && updateData.stock !== product.stock) {
      if (updateData.stock < 0) {
        throw new Error("Stok sayısı negatif olamaz");
      }

      const beforeStock = product.stock;
      const newStock = updateData.stock;
      const changeAmount = newStock - beforeStock;

      if (newStock === 0) {
        updateData.status = "Tükendi"; 
      }

      let changeType;
      if (changeAmount > 0) {
        changeType = "ÜRÜN EKLENDİ";
      } else if (changeAmount < 0) {
        changeType = "DÜZELTME";
      }

      await Stock.create( 
        [
          {
            productId: product._id,
            changeType,
            beforeStock,
            changeAmount,
            newStock,
            userId,
          },
        ],
        { session },
      );
    }

    Object.assign(product, updateData);
    await product.save({ session });

    await session.commitTransaction();

    utils.logger.info("Ürünler güncellendi", { productId: id }); 

    return product;
  } catch (error) {
    await session.abortTransaction();
throw error
  } finally {
    session.endSession(); 
  }
};