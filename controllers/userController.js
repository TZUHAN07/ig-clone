const User = require("../models/userModel");
const { uploadToS3 } = require("../config/s3");
const { resizeImage } = require("../config/imageService");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = {};

  try {
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "無權限更新此使用者",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "未找到使用者",
      });
    }

    if (req.file) {
      const oldImageUrl = user.avatar;

      const resizedBuffer = await resizeImage(req.file.buffer);
      req.file.buffer = resizedBuffer;
      const avatarUrl = await uploadToS3(req.file, "avatars");
      updateData.avatar = avatarUrl;

      if (oldImageUrl) {
        deleteImageFromS3(oldImageUrl);
        console.log("已刪除就圖片");
      }
    }

    if (Object.keys(req.body).length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "請提供更新內容" });
    }

    const updateUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "未找到使用者",
      });
    }

    res.status(200).json({
      success: true,
      message: "使用者更新成功",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "無權限更新此使用者",
      });
    }

    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "未找到使用者",
      });
    }

    res.status(200).json({
      success: true,
      message: "用戶已成功刪除",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "未找到使用者",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUser,
  getMe,
};
