const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

router.post("/users", UserController.createUser);
router.get("/users/:userId", UserController.getUser);
router.get("/users", UserController.getAllUsers);

module.exports = router;
