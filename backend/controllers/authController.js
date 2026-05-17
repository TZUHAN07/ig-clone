const User = require("../models/userModel");
const { asyncHandler, AppError } = require("../middleware/errorHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError("請提供所有必填欄位", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("請提供有效的電子郵件地址", 400);
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new AppError("密碼需至少8碼，包含大小寫字母與數字", 400);
  }

  if (username.length < 2 || username.length > 20) {
    throw new AppError("用戶名需介於 2-20 個字元", 400);
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new AppError("此電子郵件已被使用", 400);
  }

  const existingUsername = await User.findOne({ username: username });
  if (existingUsername) {
    throw new AppError("此用戶名已被使用", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();
  res.status(201).json({
    success: true,
    message: `${savedUser.username}註冊成功`,
    data: savedUser,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("請提供所有必填欄位", 400);
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError("找不到此使用者", 400);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("密碼錯誤", 400);
  }

  const payload = {
    user_id: user._id,
    user_email: user.email,
    user_name: user.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  res.status(200).json({
    success: true,
    message: `${user.username} 登入成功`,
    token: token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

module.exports = {
  register,
  login,
};
