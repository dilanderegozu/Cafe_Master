const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const configs = require("./configs/index");
const db = require("./db/index");
const router = require("./routers/index");
const { initSocket } = require("./configs/socket.config");
const mongoose = require("mongoose");

require("./configs/redis.config");

const app = express();
const server = http.createServer(app);
const io = initSocket(server); // 

const PORT = process.env.PORT || 3000;


configs.serverConfig.initialServerConfig();



app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "*", 
}));



app.set("view engine", "ejs");


app.use(process.env.APP_PREFIX, router);


app.get("/", (req, res) => {
  res.json({ 
    message: "Server çalışıyor",
    socketStatus: "aktif" 
  });
});


db.db.mongoConnect()
  .then(() => {
    server.listen(PORT, () => { 
       console.log(" MongoDB bağlantısı başarılı");
    console.log(` Veritabanı: ${mongoose.connection.name}`);
      console.log(` Server ${PORT} portunda çalışıyor`);
      console.log(` Socket.io aktif`);
      console.log(` API Prefix: ${process.env.APP_PREFIX}`);
    });
  })
  .catch((e) => {
    console.error(" MongoDB bağlantı hatası:", e.message);
   
  });

