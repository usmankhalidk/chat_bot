const express = require("express");
const ChatController = require("../controllers/chatController");

const router = express.Router();

router.post("/chat", ChatController.handleChat);
router.get("/history", ChatController.getHistory);

module.exports = router;
module.exports = router;
