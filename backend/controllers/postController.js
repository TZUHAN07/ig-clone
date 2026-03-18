const Post = require("../models/postModel");
const { uploadToS3, deleteImageFromS3 } = require("../config/s3");
const { resizeImage } = require("../config/imageService");
const { File } = require("buffer");

const createPosts = async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  try {
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "文字內容不能為空",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "請上傳圖片檔案",
      });
    }

    const resizedBuffer = await resizeImage(req.file.buffer);
    req.file.buffer = resizedBuffer;
    const uploadedImage = await uploadToS3(req.file, "posts");

    const newPost = new Post({
      user: userId,
      content,
      image: uploadedImage,
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate({
      path: "user",
      select: "username avatar",
    });

    res.status(201).json({
      success: true,
      message: "發文成功",
      data: populatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getPosts = async (req, res) => {
  const { id } = req.params;

  try {
    const getPost = await Post.findById(id).populate({
      path: "user",
      select: "username avatar",
    });

    if (!getPost) {
      return res.status(404).json({
        success: false,
        message: "貼文不存在",
      });
    }
    res.status(200).json({
      success: true,
      message: "取得貼文成功",
      data: getPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updatePosts = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const { content } = req.body || {};
  console.log("content", content);
  const updateData = {};

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "貼文不存在",
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "您無權修改此貼文",
      });
    }

    if (content !== undefined) {
      if (content.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "文字內容不能為空",
        });
      }

      updateData.content = content;
    }

    let oldImageUrl; 

    if (req.file) {
      oldImageUrl = post.image;

      const resizedBuffer = await resizeImage(req.file.buffer);
      req.file.buffer = resizedBuffer;
      const updatePostImage = await uploadToS3(req.file, "posts");
      updateData.image = updatePostImage;
    }

    if (oldImageUrl){
      deleteImageFromS3(oldImageUrl);
      console.log("已刪除就圖片")
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "請提供要更新的內容",
      });
    }

    const updatePost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate({
      path: "user",
      select: "username avatar",
    });
    console.log(updatePost);

    res.status(200).json({
      success: true,
      message: "貼文已更新",
      data: updatePost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deletePosts = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "貼文不存在",
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "您無權刪除此貼文",
      });
    }

    if (post.image) {
      await deleteImageFromS3(post.image);
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "貼文已刪除",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate({
        path: "user",
        select: "username avatar",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "取得所有貼文成功",
      data: allPosts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createPosts,
  getPosts,
  updatePosts,
  deletePosts,
  getAllPosts,
};
