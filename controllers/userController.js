const User = require("../models/userModel");

const getAllUsers =async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    }catch (err){
        res.status(500).json({ message: err.message });

    }
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getUser = async (req, res) => {
    const id = req.params.id;
    try{
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch (err){
        res.status(500).json({ message: err.message });     
    }
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
}