const Post = require("../models/postModel");
const User = require("../models/userModel");
const { uploadToS3, deleteImageFromS3 } = require("../config/s3");
const { resizeImage } = require("../config/imageService");
const { File } = require("buffer");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

const createPosts = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  if (!content || content.trim() === "") {
    throw new AppError("文字內容不能為空", 400);
  }

  if (!req.file) {
    throw new AppError("請上傳圖片檔案", 400);
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
});

const getPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const getPost = await Post.findById(id).populate({
    path: "user",
    select: "username avatar",
  });

  if (!getPost) {
    throw new AppError("貼文不存在", 404);
  }

  res.status(200).json({
    success: true,
    message: "取得貼文成功",
    data: getPost,
  });
});

const updatePosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const { content } = req.body || {};
  const updateData = {};

  const post = await Post.findById(id);
  if (!post) {
    throw new AppError("貼文不存在", 404);
  }

  if (post.user.toString() !== userId.toString()) {
    throw new AppError("您無權修改此貼文", 403);
  }

  if (content !== undefined) {
    if (content.trim() === "") {
      throw new AppError("文字內容不能為空", 400);
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

  if (oldImageUrl) {
    deleteImageFromS3(oldImageUrl);
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("請提供要更新的內容", 400);
  }

  const updatePost = await Post.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate({
    path: "user",
    select: "username avatar",
  });

  res.status(200).json({
    success: true,
    message: "貼文已更新",
    data: updatePost,
  });
});

const deletePosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(id);
  if (!post) {
    throw new AppError("貼文不存在", 404);
  }

  if (post.user.toString() !== userId.toString()) {
    throw new AppError("您無權刪除此貼文", 403);
  }

  if (post.image) {
    await deleteImageFromS3(post.image);
  }

  await Post.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "貼文已刪除",
  });
});

const getAllPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const me = await User.findById(userId).select("following");
  const query = { user: { $nin: [...me.following, userId] } };

  const totalCount = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .populate({
      path: "user",
      select: "username avatar",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "取得所有貼文成功",
    data: posts,
    pagination: {
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
    },
  });
});

const getFollowingPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const me = await User.findById(userId).select("following");

  const query = { user: { $in: [...me.following] } };

  const followingCount = await Post.countDocuments(query);

  let finalQuery = query;
  if (followingCount === 0) {
    finalQuery = { user: { $ne: userId } };
  }

  const total = await Post.countDocuments(finalQuery);

  const posts = await Post.find(finalQuery)
    .populate({
      path: "user",
      select: "username avatar",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "取得追蹤貼文成功",
    data: posts,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
});

const getUserPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const query = { user: id };

  const totalCount = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .populate({
      path: "user",
      select: "username avatar",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "取得使用者貼文成功",
    data: posts,
    pagination: {
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
    },
  });
});

module.exports = {
  createPosts,
  getPosts,
  updatePosts,
  deletePosts,
  getAllPosts,
  getFollowingPosts,
  getUserPosts,
};
