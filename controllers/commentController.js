const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const getIO = require("../config/socket");

const createComments = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { content } = req.body;
  console.log(content);

  try {
    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "留言不能為空",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "貼文不存在",
      });
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

    if(post.user._id.toString() !== userId.toString()) {
      getIO.to(post.user.toString()).emit("notification", {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await Comment.find({ post: postId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "取得留言成功",
      data: comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;
  console.log(commentId, userId)

  try {
    const comment = await Comment.findById(commentId);
    console.log(comment)
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "留言不存在",
      });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "您無權刪除此留言",
      });
    }

    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "留言已刪除",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createComments,
  getComments,
  deleteComment,
};
