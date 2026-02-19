const socketIO = require("socket.io");
let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Yeni bağlantı: ${socket.id}`);

    socket.on("join-table", (tableNumber) => {
      socket.join(`table-${tableNumber}`);
      console.log(`📍 Socket ${socket.id} masa ${tableNumber}'ye katıldı`);
    });


    socket.on("join-kitchen", () => {
      socket.join("kitchen");
      console.log(`👨‍🍳 Socket ${socket.id} mutfağa katıldı`);
    });


    socket.on("join-cashier", () => {
      socket.join("cashier");
      console.log(`💰 Socket ${socket.id} kasaya katıldı`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Bağlantı koptu: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io henüz başlatılmadı!");
  }
  return io;
};

module.exports = { initSocket, getIO };
