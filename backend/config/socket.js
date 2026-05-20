const jwt = require("jsonwebtoken");
const Message = require("../models/messageModel");
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

    socket.on("sendMessage", async (payload, callback) => {
      try {
        const { recipientId, content } = payload || {};

        const senderId = socket.data.userId;

        if (!recipientId || !content || !content.trim()) {
          return callback({
            success: false,
            message: "recipientId 和 content 是必填",
          });
        }
        if (recipientId === senderId.toString()) {
          return callback({ success: false, message: "不能傳給自己" });
        }

        const newMessage = await Message.create({
          sender: senderId,
          recipient: recipientId,
          content,
        });

        const populated = await newMessage.populate(
          "sender",
          "username avatar",
        );

        io.to(recipientId).emit("receiveMessage", populated);

        io.to(senderId.toString()).emit("receiveMessage", populated);

        callback({ success: true, data: populated });
      } catch (err) {
        console.error("[ERROR] sendMessage:", err);
        callback({ success: false, message: "傳送失敗" });
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io 尚未初始化");
  return io;
};

module.exports = { initSocket, getIO };
