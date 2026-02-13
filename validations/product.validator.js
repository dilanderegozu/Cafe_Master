const { body, param, query } = require("express-validator");

const ProductValidator = {

  validateCreateProduct() {
    return [

      body("name")
        .notEmpty().withMessage("Ürün adı zorunludur")
    ,

      body("price")
        .notEmpty().withMessage("Fiyat zorunludur")
        .isFloat({ min: 0 }).withMessage("Fiyat 0'dan küçük olamaz"),

      body("stock")
        .notEmpty().withMessage("Stok zorunludur")
        .isInt({ min: 0 }).withMessage("Stok 0'dan küçük olamaz"),

      body("discountRate")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("İndirim oranı 0-100 arasında olmalıdır"),

      body("category")
        .notEmpty().withMessage("Kategori zorunludur")
       ,

      body("subCategory")
        .notEmpty().withMessage("Alt kategori zorunludur")
       
    ];
  },

  validateUpdateProduct() {
    return [

      param("id")
        .isMongoId()
        .withMessage("Geçersiz ürün ID"),

      body("name")
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage("Ürün adı 2-50 karakter arası olmalıdır")
        .trim(),

      body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Fiyat 0'dan küçük olamaz"),

      body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stok 0'dan küçük olamaz"),

      body("discountRate")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage("İndirim oranı 0-100 arasında olmalıdır"),

      body("category")
        .optional()
        .withMessage("Geçersiz kategori"),
    ];
  },

  validateDeleteProduct() {
    return [
      param("id")
        .isMongoId()
        .withMessage("Geçersiz ürün ID"),
    ];
  },

  validateGetProduct() {
    return [
      param("id")
        .isMongoId()
        .withMessage("Geçersiz ürün ID"),
    ];
  }

};

module.exports = ProductValidator;

