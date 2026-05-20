const Message = require("../models/messageModel");
const { asyncHandler } = require("../middleware/errorHandler");
const mongoose = require("mongoose");

// GET /messages/:userId  跟某 user 的對話歷史
const getMessagesWithUser = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { userId: otherId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: myId, recipient: otherId },
      { sender: otherId, recipient: myId },
    ],
  })
    .populate("sender", "username avatar")
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    data: messages,
  });
});

// GET /messages  我的聊天列表（最近聯絡的人 + 最後一句訊息）
const getConversationList = asyncHandler(async (req, res) => {
  const myId = new mongoose.Types.ObjectId(req.user._id);

  const conversations = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: myId }, { recipient: myId }],
      },
    },

    { $sort: { createdAt: -1 } },

    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", myId] }, "$recipient", "$sender"],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        user: { _id: 1, username: 1, avatar: 1 },
        lastMessage: 1,
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: conversations,
  });
});

module.exports = {
  getMessagesWithUser,
  getConversationList,
};
