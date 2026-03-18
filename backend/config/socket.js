let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`userId ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io 尚未初始化");
  return io;
};

module.exports = { initSocket, getIO };