const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
} = require("../controllers/userController");

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} = require("../controllers/followController");

router.get("/", getAllUsers);
router.get("/me", authMiddleware, getMe);
router.get("/:id", getUser);
router.put("/:id", authMiddleware, upload.single("avatar"), updateUser);
router.delete("/:id", authMiddleware, deleteUser);

router.post("/:id/follow", authMiddleware, followUser);
router.delete("/:id/unfollow", authMiddleware, unfollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);

module.exports = router;
