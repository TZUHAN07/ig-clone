const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("/", async (req, res) => {
  try {
    const { user, content, image } = req.body;

    const newPost = new Post({
      user,
      content,
      image,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const getPost = await Post.findById(id);
    res.status(200).json(getPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  console.log(body.user)

  try {
    const updatePost = await Post.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    res.status(200).json(updatePost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletePost = await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;
