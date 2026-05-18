const User = require("../models/userModel");
const { uploadToS3, deleteImageFromS3 } = require("../config/s3");
const { resizeImage } = require("../config/imageService");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: users,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  if (req.user._id.toString() !== id) {
    throw new AppError("無權限更新此使用者", 403);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("未找到使用者", 404);
  }

  if (req.file) {
    const oldImageUrl = user.avatar;

    const resizedBuffer = await resizeImage(req.file.buffer);
    req.file.buffer = resizedBuffer;
    const avatarUrl = await uploadToS3(req.file, "avatars");
    updateData.avatar = avatarUrl;

    if (oldImageUrl) {
      deleteImageFromS3(oldImageUrl);
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("請提供要更新的內容", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new AppError("未找到使用者", 404);
  }

  res.status(200).json({
    success: true,
    message: "使用者更新成功",
    data: updatedUser,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id) {
    throw new AppError("無權限更新此使用者", 403);
  }

  const user = await User.findById(id);
  if (user && user.avatar) {
    await deleteImageFromS3(user.avatar);
  }

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new AppError("未找到使用者", 404);
  }

  res.status(200).json({
    success: true,
    message: "用戶已成功刪除",
  });
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new AppError("未找到使用者", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.json({ success: true, data: [] });
  }

  const users = await User.find({
    username: { $regex: query, $options: "i" },
  })
    .select("username avatar")
    .limit(20);

  res.json({
    success: true,
    data: users,
  });
});

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  getMe,
  searchUsers,
};
