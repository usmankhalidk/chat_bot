const createError = require("http-errors");
const User = require("../models/User");

class UserController {
  static async createUser(req, res, next) {
    try {
      const { username, email } = req.body;

      if (!username || !email) {
        throw createError(400, "Username and email are required");
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        throw createError(409, "Username or email already exists");
      }

      const user = await User.create({ username, email });

      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req, res, next) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user) throw createError(404, "User not found");

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  static async getAllUsers(req, res, next) {
    try {
      const users = await User.find()
        .select("-__v") // Exclude version key
        .lean(); // Convert to plain JavaScript objects

      if (!users || users.length === 0) {
        throw createError(404, "No users found");
      }

      res.status(200).json({
        message: "Users retrived Successfully...",
        success: true,
        data: users.map((user) => ({
          id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = UserController;
