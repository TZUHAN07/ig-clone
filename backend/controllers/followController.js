const User = require("../models/userModel");
const {getIO} = require("../config/socket");

const followUser = async (req, res) => {
  const targetId = req.params.id;
  const myId = req.user._id;
  console.log(targetId, myId);

  try {
    if (targetId === myId.toString()) {
      return res.status(400).json({
        success: false,
        message: "不能追蹤自己",
      });
    }

    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "找不到使用者",
      });
    }
    if (targetUser.followers.some(id => id.equals(myId))) {
      return res.status(400).json({
        success: false,
        message: "已追蹤過此使用者",
      });
    }
    await User.findByIdAndUpdate(targetId, { $push: { followers: myId } });
    await User.findByIdAndUpdate(myId, { $push: { following: targetId } });

    getIO.to(targetId).emit("notification", {
      type: "follow",
      message: "有人追蹤你",
      fromUser: myId,
    });

    res.status(200).json({
      success: true,
      message: "追蹤成功",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const unfollowUser = async (req, res) => {
  const targetId = req.params.id;
  const myId = req.user._id;

  try{
    if (targetId === myId.toString()) {
      return res.status(400).json({
        success: false,
        message: "不能取消追蹤自己",
      });
    }

    const targetUser = await User.findById(targetId);

    if(!targetUser){
      return res.status(404).json({
        success: false,
        message: "找不到使用者",
      });
    }

    if(!targetUser.followers.some(id => id.equals(myId))){
      return res.status(400).json({
        success: false,
        message: "未追蹤此使用者",
      });
    }

    await User.findByIdAndUpdate(targetId, { $pull: { followers: myId } });
    await User.findByIdAndUpdate(myId, { $pull: { following: targetId } });
    res.status(200).json({
        success: true,
        message: "已取消追蹤"
    })
  }catch(err){
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

const getFollowers =async (req, res) => {
    try{
        const  user = await User.findById(req.params.id)
        .select("followers")
        .populate("followers", "username avatar");
        

        if (!user){
            return res.status(404).json({
                success: false,
                message: "找不到使用者"
            })
        }

        res.status(200).json({
            success: true,
            data: user.followers
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getFollowing =async (req, res) => {
    try{
        const  user = await User.findById(req.params.id)
        .select("following")
        .populate("following", "username avatar");
        

        if (!user){
            return res.status(404).json({
                success: false,
                message: "找不到使用者"
            })
        }   

        res.status(200).json({
            success: true,
            data: user.following
        })  
                                
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
};