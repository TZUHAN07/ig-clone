const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "媒體 URL 是必填的"],
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
  },
  { _id: false },
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "文字內容是必填的"],
    },
    media: {
      type: [mediaSchema],
      required: [true, "圖片是必填的"],
             validate: [
        (arr) => arr.length >= 1 && arr.length <= 10,
        "媒體數量需介於 1-10 張",
      ],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
