const express = require("express");
const router = express.Router();

const user = require("../controllers/user.controller.js");

// Create a new User
router.post("/", user.create);

// Retrieve all Users
router.get("/", user.findAll);

// Retrieve a single User with userId
router.get("/:userId", user.findOne);

// Update a User with userId
router.put("/:userId", user.update);

// Delete a User with userId
router.delete("/:userId", user.delete);

module.exports = router;