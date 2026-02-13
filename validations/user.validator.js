const { body, query } = require("express-validator");

const UserValidator = {

  validateCreateUser() {
    return [
      body("email")
        .isEmail()
        .withMessage("Geçerli bir email giriniz"),

      body("password")
        .isLength({ min: 6 })
        .withMessage("Şifre en az 6 karakter olmalıdır"),

      body("birthDate")
        .isISO8601()
        .withMessage("Geçerli bir tarih giriniz"),
    ];
  },

  validateUpdateUser() {
    return [
      body("email")
        .optional()
        .isEmail()
        .withMessage("Geçerli bir email giriniz"),
    ];
  },

  validateSignIn() {
    return [
      body("email")
        .isEmail()
        .withMessage("Email zorunludur"),

      body("password")
        .notEmpty()
        .withMessage("Şifre zorunludur"),
    ];
  },

  validateUpdateAvatar() {
    return [
      query("id")
        .isMongoId()
        .withMessage("Geçersiz ID"),
    ];
  },

};


module.exports = UserValidator;
