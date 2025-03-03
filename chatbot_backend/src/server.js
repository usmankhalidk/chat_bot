const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const assistantRoutes = require("./routes/assistantRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", chatRoutes);
app.use("/api", userRoutes);
app.use("/api", assistantRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Error Handling
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
