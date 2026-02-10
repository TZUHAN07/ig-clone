const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://ui-avatars.com/api/?name=User&background=random&color=ffffff&size=200",
    },
  },
  {
    versionKey: false,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
