const Post = require("../models/postModel");
const { getIO } = require("../config/socket");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId).populate("user", "_id");
  if (!post) {
    throw new AppError("貼文不存在", 404);
  }

  if (post.likes.some((id) => id.equals(userId))) {
    throw new AppError("已讚過此貼文", 400);
  }

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $push: { likes: userId } },
    { new: true },
  );

  if (post.user._id.toString() !== userId.toString()) {
    getIO().to(post.user._id.toString()).emit("notification", {
      type: "like",
      message: "有人按讚你的貼文",
      postId,
      fromUser: userId,
    });
  }

  res.status(200).json({
    success: true,
    message: "按讚貼文",
    likes: updated.likes,
  });
});

const unlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("貼文不存在", 404);
  }

  if (!post.likes.some((id) => id.equals(userId))) {
    throw new AppError("尚未讚過此貼文", 400);
  }

  const updated = await Post.findByIdAndUpdate(
    postId,
    { $pull: { likes: userId } },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "取消讚貼文",
    likes: updated.likes,
  });
});

module.exports = { likePost, unlikePost };
