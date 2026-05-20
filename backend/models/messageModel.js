const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // populate 拿 username/avatar 用
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "訊息內容是必填的"],
      maxLength: [1000, "訊息不能超過 1000 字"], 
    },
    read: {
      type: Boolean,
      default: false, 
    },
  },
  { versionKey: false, timestamps: true }, 
);

module.exports = mongoose.model("Message", messageSchema);