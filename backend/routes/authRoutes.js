const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiters");

// authLimiter 只貼到登入註冊，避免暴力破解；其他 API 不受影響
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
