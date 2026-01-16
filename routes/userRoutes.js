const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser
} = require("../controllers/userController");


router.get("/", getAllUsers);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.get("/:id", getUser);

module.exports = router;
