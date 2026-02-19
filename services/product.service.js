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
          userId: userId,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await utils.redisHelper.delete("products:all");
    utils.logger.info("Product created", {
      productId: product._id,
      name: product.name,
    });

    if (product.stock <= 10) {
      const io = getIO();
      io.to("admin").emit("low-stock-alert", {
        productId: product._id,
        productName: product.name,
        currentStock: product.stock,
        message: "Yeni ürün eklendi, stok düşük!",
        timestamp: new Date(),
      });
    }
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
    const cachedProducts = await utils.redisHelper.get("products:all");
    if (cachedProducts) {
      console.log("Cache HIT: prdocuts:all");
      return cachedProducts;
    }
    console.log("Cache MISS: products:all");

    //cachede yoksa dbden çekicez
    const products = await Product.find();
    const formattedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
    }));
    await utils.redisHelper.set("products:all", formattedProducts, 3600);
    return formattedProducts;
  } catch (error) {
    throw error;
  }
};

exports.getProductById = async (id) => {
  try {
    const cacheKey = `products:${id}`;
    const cachedProduct = await utils.redisHelper.get(cacheKey);
    if (cachedProduct) {
      console.log(` Cache HIT: ${cacheKey}`);
      return cachedProduct;
    }

    console.log(` Cache MISS: ${cacheKey}`);

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Ürün bulunamadı");
    }

    const formattedProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt,
    };

    await utils.redisHelper.set(cacheKey, formattedProduct, 3600);
    return formattedProduct;
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

    await utils.redisHelper.delete(`products:${id}`);
    await utils.redisHelper.delete(`products:all`);
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
    if (product.stock <= 10) {
      const io = getIO();
      io.to("admin").emit("Stok uyarısı", {
        productId: product._id,
        productName: product.name,
        currentStock: product.stock,
        message: "Stok seviyesi kritik!",
        timestamp: new Date(),
      });
    }
    Object.assign(product, updateData);
    await product.save({ session });

    await session.commitTransaction();
    await utils.redisHelper.delete(`products:${id}`); //güncellenen ürün temizlendi
    await utils.redisHelper.delete("products:all"); // tüm ürünler listesi temizlendi
    utils.logger.info("Ürünler güncellendi", { productId: id });

    return product;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
