const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getMessagesWithUser,
  getConversationList,
} = require("../controllers/messageController");

router.use(authMiddleware);

router.get("/:userId", getMessagesWithUser);
router.get("/", getConversationList);

module.exports = router;
