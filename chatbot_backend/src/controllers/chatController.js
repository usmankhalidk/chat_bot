const createError = require("http-errors");
const Chat = require("../models/Chat");
const Assistant = require("../models/Assistant");
const User = require("../models/User");
const { getMockResponse } = require("../utils/mockResponses");

class ChatController {
  static async handleChat(req, res, next) {
    try {
      const { message, threadId, userId } = req.body;

      // Only require message, userId is optional
      if (!message) {
        throw createError(400, "Message is required");
      }

      let chat;
      const userMessage = {
        sender: "user",
        content: message,
        timestamp: new Date(),
      };
      const aiResponse = getMockResponse(message);

      if (userId) {
        // If userId is provided, validate user and handle chat persistence
        const user = await User.findById(userId);
        if (!user) {
          throw createError(404, "User not found");
        }

        if (threadId) {
          chat = await Chat.findOneAndUpdate(
            { threadId, userId },
            { $push: { messages: { $each: [userMessage, aiResponse] } } },
            { new: true }
          );
          if (!chat) throw createError(404, "Chat thread not found");
        } else {
          chat = await Chat.create({
            threadId: Date.now().toString(),
            userId,
            messages: [userMessage, aiResponse],
          });
        }
      } else {
        // If no userId, just generate a temporary threadId and return response without saving
        chat = {
          threadId: threadId || Date.now().toString(), // Use provided threadId or generate new
          messages: [userMessage, aiResponse],
        };
      }

      res.status(200).json({
        success: true,
        data: { threadId: chat.threadId, response: aiResponse },
      });
    } catch (error) {
      next(error);
    }
  }
  static async getHistory(req, res, next) {
    try {
      const { userId } = req.query;

      if (!userId) throw createError(400, "userId is required");

      const user = await User.findById(userId);
      if (!user) throw createError(404, "User not found");

      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).lean(); // Use lean() for performance since we don’t need Mongoose documents

      if (!chats || chats.length === 0) {
        throw createError(404, "No chat history found for this user");
      }

      res.status(200).json({
        success: true,
        data: chats.map((chat) => ({
          threadId: chat.threadId,
          title: chat.messages[0]?.content.substring(0, 50) || "Untitled",
          messages: chat.messages, // Include all messages in the thread
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssistants(req, res, next) {
    try {
      let assistants = await Assistant.find();
      if (assistants.length === 0) {
        const defaultAssistants = [
          {
            name: "General Assistant",
            icon: "🤖",
            description: "All-purpose AI helper",
          },
          {
            name: "Tech Expert",
            icon: "💻",
            description: "Technical support AI",
          },
          {
            name: "Creative Buddy",
            icon: "🎨",
            description: "Creative assistance AI",
          },
          {
            name: "Knowledge Guru",
            icon: "📚",
            description: "Information expert AI",
          },
        ];
        assistants = await Assistant.insertMany(defaultAssistants);
      }

      res.status(200).json({ success: true, data: assistants });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChatController;
