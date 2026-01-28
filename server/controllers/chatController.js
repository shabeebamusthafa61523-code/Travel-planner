const GlobalChat = require("../models/Chat");

// GET /api/chat/global
const getGlobalMessages = async (req, res) => {
  try {
    const messages = await GlobalChat.find()
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// POST /api/chat/global
const sendGlobalMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newMessage = await GlobalChat.create({
      sender: req.user.id,
      message,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = {
  getGlobalMessages,
  sendGlobalMessage,
};
