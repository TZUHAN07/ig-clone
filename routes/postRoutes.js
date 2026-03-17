const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getAllPosts,
  createPosts,
  getPosts,
  updatePosts,
  deletePosts,
} = require("../controllers/postController");

const {
  likePost,
  unlikePost,
} = require("../controllers/likeController");

const {
  createComments,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

router.get("/", authMiddleware, getAllPosts);
router.get("/:id", authMiddleware, getPosts);
router.post("/", authMiddleware, upload.single("image"), createPosts);
router.put("/:id", authMiddleware, upload.single("image"), updatePosts);

router.post("/:id/like", authMiddleware, likePost);
router.delete("/:id/like", authMiddleware, unlikePost);

router.post("/:id/comments", authMiddleware, createComments);
router.get("/:id/comments", getComments);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

router.delete("/:id", authMiddleware, deletePosts);

module.exports = router;
