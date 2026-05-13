const jwt = require("jsonwebtoken");
let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("未授權"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.userId = decoded.user_id;
      next();
    } catch (err) {
      next(new Error("token 無效或已過期"));
    }
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id, "userId:", socket.data.userId);

    socket.join(socket.data.userId);

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
