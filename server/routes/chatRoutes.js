const express = require("express");
const router = express.Router();

const {
  getGlobalMessages,
  sendGlobalMessage,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

// Global (common) chat
router.get("/global", authMiddleware, getGlobalMessages);
router.post("/global", authMiddleware, sendGlobalMessage);

module.exports = router;
