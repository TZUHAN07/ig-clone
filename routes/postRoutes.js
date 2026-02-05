const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPosts,
  getPosts,
  updatePosts,
  deletePosts,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPosts);

router.post("/", authMiddleware, createPosts);
router.put("/:id", authMiddleware, updatePosts);
router.delete("/:id", authMiddleware, deletePosts);

module.exports = router;
