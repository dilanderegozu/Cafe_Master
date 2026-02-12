const User = require("../models/user.model");
const utils = require("../utils/index");
const userDal = require("../dal/index");


exports.createUser = async (req) => {
  try {
    const { name, surname, email, password } = req.body;
    const _password = utils.helper.hashToPassword(password);
    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new Error("Bu e-mail zaten kayıtlı");
    }
    const user = new User({
      name,
      surname,
      email,
      password: _password,
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

exports.signIn = async (req) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    const isPasswordValid = utils.helper.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Şifre hatalı");
    }

    return {
      id: user._id, //mongodb için _id olması daha mantıklı
      email: user.email,
    };
  } catch (error) {
    throw error;
  }
};

exports.getAllUser = async () => {
  try {
    const users = await User.find({}, { password: 0 });

    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));
  } catch (error) {
    throw error;
  }
};

exports.getUser = async (req) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { password: 0 });
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteUser = async (req) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }
    return "Kullanıcı başarı ile silindi";
  } catch (error) {
    throw new Error(error);
  }
};

exports.updateUser = async (req) => {
  try {
    const { id } = req.params;
    const { name, surname, email, password } = req.body;

    let updateData = {};

    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;
    if (email) updateData.email = email;

    if (password) {
      updateData.password = utils.helper.hashToPassword(password);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı");
    }

    return {
      id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const _password = utils.helper.hashToPassword(password);
    const json = await userDal.user.updateById(id, { password: _password });
    if (json) {
      const token = utils.helper.createToken(json._id, json.name);
      return {
        id: json_.id,
        token,
        _password,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};
