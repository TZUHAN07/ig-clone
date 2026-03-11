const express = require("express");
const router = express.Router();

const {
  getAllPosts,
  createPosts,
  getPosts,
  updatePosts,
  deletePosts,
} = require("../controllers/postController");

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPosts);

router.post("/", authMiddleware, upload.single("image"), createPosts);
router.put("/:id", authMiddleware, upload.single("image"), updatePosts);
router.delete("/:id", authMiddleware, deletePosts);

module.exports = router;
