require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/ai-chat",
  corsOptions: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
};

module.exports = config;
