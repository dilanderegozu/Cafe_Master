const mongoose = require("mongoose");

exports.mongoConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI,{
            dbName:process.env.DB_NAME,
            connectTimeoutMS:process.env.CONNECTIONTIMEOUTMS
        })
        console.log("DB CONNECTED");
        
    } catch (error) {
        throw new Error(error.message)
    }
};
