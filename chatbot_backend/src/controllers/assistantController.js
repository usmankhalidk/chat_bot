const createError = require("http-errors");
const Chat = require("../models/Chat");
const Assistant = require("../models/Assistant");
const User = require("../models/User");
const { getMockResponse } = require("../utils/mockResponses");

class AssistantController {

    static async createAssistant(req, res, next) {
        try {
          const { name, icon, description } = req.body;
    
          if (!name || !icon || !description) {
            throw createError(400, 'Name, icon, and description are required');
          }
    
          const existingAssistant = await Assistant.findOne({ name });
          if (existingAssistant) {
            throw createError(409, 'Assistant with this name already exists');
          }
    
          const assistant = await Assistant.create({ name, icon, description });
    
          res.status(201).json({
            success: true,
            data: {
              id: assistant._id,
              name: assistant.name,
              icon: assistant.icon,
              description: assistant.description,
              createdAt: assistant.createdAt
            }
          });
        } catch (error) {
          next(error);
        }
      }
    


    static async addAssistants(req, res, next) {
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

module.exports = AssistantController;
