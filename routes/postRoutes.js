const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  createPosts,
  getPosts,
  updatePosts,
  deletePosts
} = require("../controllers/postController");

router.get("/", getAllPosts);

router.post("/", createPosts);

router.get("/:id", getPosts);

router.put("/:id", updatePosts);

router.delete("/:id", deletePosts);


module.exports = router;
