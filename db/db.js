const mongoose = require("mongoose");

exports.mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      connectTimeoutMS: process.env.CONNECTIONTIMEOUTMS,
    });
  } catch (error) {
    throw new error(error.message);
  }
};