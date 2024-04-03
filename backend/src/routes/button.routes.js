const express = require("express");
const router = express.Router();

const button = require("../controllers/button.controller.js");

// Create a new Widget
router.post("/", button.create);

// Retrieve a single Button with button_id
router.get("/:button_id", button.findOne);

module.exports = router;
