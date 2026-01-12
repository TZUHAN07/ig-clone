const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

