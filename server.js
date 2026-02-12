const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const configs = require("./configs/index");
const db = require("./db/index");
const router = require("./routers/index");
const consts = require("./consts/index");
const app = express();
const utils = require("./utils/index");

const PORT = process.env.PORT || 3000;

configs.serverConfig.initialServerConfig();
utils.helper.createUploadDir("./uploads");


app.use(express.json());
app.use(helmet());

app.use(cors({
  origin: "*"
}));

app.use("/uploads", express.static("uploads"));

const ejs = require("ejs");
app.set("view engine", "ejs");



app.use(process.env.APP_PREFIX, router); 
db.mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});















































// const express = require("express");
// const app = express();
// app.use(express.json())
// const server = require("http").createServer(app);
// const io = require("socket.io")(server, { cors: { origin: "*" } });

// app.set("view engine", "ejs");
// app.get("/home", (rerq, res) => {
//   res.render("home");
// });

// server.listen(3001, () => {
//   console.log("Server running");
// });

// io.on("connection", (socket) => {
//   console.log("User connected: " + socket.id);

//   socket.on("message", (data) => {
//     socket.broadcast.emit("message", data);
//   });
// });
