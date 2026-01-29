const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const generateToken = (user) => {}

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "請提供所有必填欄位" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "此電子郵件已被使用" });
    }

    const existingUsername = await User.findOne({ username: username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "此用戶名已被使用" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    console.log(newUser);

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if ( !email || !password) {
      return res.status(400).json({ message: "請提供所有必填欄位" });
    }
    const user = await User.findOne({ email: email });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "找不到使用者" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "密碼錯誤" });
    }

    const payload ={
      user_id: user._id,
      user_email: user.email,
      user_name: user.username
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });
    console.log(token);

    res
      .cookie("jwt", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: `${user.username} is logged in`, jwtToken: token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login
};
