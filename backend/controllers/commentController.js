const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { getIO } = require("../config/socket");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

const createComments = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new AppError("留言不能為空", 400);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError("貼文不存在", 404);
  }

  const newComment = new Comment({
    user: userId,
    post: postId,
    content,
  });

  const savedComment = await newComment.save();

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: savedComment._id },
  });

  const populated = await savedComment.populate("user", "username avatar");

  if (post.user._id.toString() !== userId.toString()) {
    getIO().to(post.user.toString()).emit("notification", {
      type: "comment",
      message: "有人留言你的貼文",
      postId,
      fromUser: userId,
      content,
    });
  }

  res.status(200).json({
    success: true,
    message: "新增留言成功",
    data: populated,
  });
});

const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ post: postId })
    .populate("user", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "取得留言成功",
    data: comments,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("留言不存在", 404);
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new AppError("您無權刪除此留言", 403);
  }

  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    success: true,
    message: "留言已刪除",
  });
});

module.exports = {
  createComments,
  getComments,
  deleteComment,
};
