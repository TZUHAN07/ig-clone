const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} = require("../controllers/userController");

const upload = require("../middleware/uploadMiddleware");

router.get("/", getAllUsers);

router.get("/me", authMiddleware, getMe);

router.get("/:id", getUser);

router.put("/:id", authMiddleware,  upload.single("avatar"), updateUser);

router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
