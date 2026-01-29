const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  let token;
  console.log(req.headers.authorization)
  try {
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "未登入",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.user_id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "使用者不存在",
      });
    }

    next();
  } catch (err) {
    console.log("Token錯誤", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token已過期",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "無效的Token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "伺服器錯誤",
    });
  }
};

module.exports = authMiddleware;
