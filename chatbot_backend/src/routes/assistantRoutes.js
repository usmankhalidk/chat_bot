const express = require("express");
const AssistantController = require("../controllers/assistantController");

const router = express.Router();

router.get("/assistants", AssistantController.getAssistants);
router.post("/assistants", AssistantController.createAssistant);

module.exports = router;
