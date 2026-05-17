const User = require("../models/userModel");
const { getIO } = require("../config/socket");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const myId = req.user._id;

  if (targetId === myId.toString()) {
    throw new AppError("不能追蹤自己", 400);
  }

  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    throw new AppError("找不到使用者", 404);
  }

  if (targetUser.followers.some((id) => id.equals(myId))) {
    throw new AppError("已追蹤過此使用者", 400);
  }

  await User.findByIdAndUpdate(targetId, { $push: { followers: myId } });
  await User.findByIdAndUpdate(myId, { $push: { following: targetId } });

  getIO().to(targetId).emit("notification", {
    type: "follow",
    message: "有人追蹤你",
    fromUser: myId,
  });

  res.status(200).json({
    success: true,
    message: "追蹤成功",
  });
});

const unfollowUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const myId = req.user._id;

  if (targetId === myId.toString()) {
    throw new AppError("不能取消追蹤自己", 400);
  }

  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    throw new AppError("找不到使用者", 404);
  }

  if (!targetUser.followers.some((id) => id.equals(myId))) {
    throw new AppError("未追蹤此使用者", 400);
  }

  await User.findByIdAndUpdate(targetId, { $pull: { followers: myId } });
  await User.findByIdAndUpdate(myId, { $pull: { following: targetId } });

  res.status(200).json({
    success: true,
    message: "已取消追蹤",
  });
});

const getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("followers")
    .populate("followers", "username avatar");

  if (!user) {
    throw new AppError("找不到使用者", 404);
  }

  res.status(200).json({
    success: true,
    data: user.followers,
  });
});

const getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("following")
    .populate("following", "username avatar");

  if (!user) {
    throw new AppError("找不到使用者", 404);
  }

  res.status(200).json({
    success: true,
    data: user.following,
  });
});

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
