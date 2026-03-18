const Post = require("../models/postModel");
const { getIO } = require("../config/socket");

const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId).populate("user", "_id");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "貼文不存在",
      });
    }

    if (post.likes.some((id) => id.equals(userId))) {
      return res.status(400).json({
        success: false,
        message: "已讚過此貼文",
      });
    }

    await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });

    if (post.user._id.toString() !== userId.toString()) {
      getIO.to(post.user._id.toString()).emit("notification", {
        type: "like",
        message: "有人按讚你的貼文",
        postId,
        fromUser: userId,
      });
    }
    res.status(200).json({
      success: true,
      message: "按讚貼文",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const unlikePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "貼文不存在",
      });
    }

    if (!post.likes.some((id) => id.equals(userId))) {
      return res.status(400).json({
        success: false,
        message: "尚未讚過此貼文",
      });
    }

    await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    res.status(200).json({
      success: true,
      message: "取消讚貼文",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { likePost, unlikePost };
