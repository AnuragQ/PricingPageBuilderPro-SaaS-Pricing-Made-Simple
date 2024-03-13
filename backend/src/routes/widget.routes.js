const express = require("express");
const router = express.Router();

const widget = require("../controllers/widget.controller.js");

// Create a new Widget
router.post("/", widget.create);

// Retrieve all Widgets
router.get("/", widget.findAll);

// Retrieve a single Widget with widgetId
router.get("/:widgetId", widget.findOne);

// Update a Widget with widgetId
router.put("/:widgetId", widget.update);

// Delete a Widget with widgetId
router.delete("/:widgetId", widget.delete);

module.exports = router;
