const express = require("express");
const router = express.Router();
const widget = require("../controllers/widget.controller.js");

// Create a new Widget
router.post("/", widget.create);
console.log("widget.routes.js");
router.post("/deploy/:widgetId", widget.deploy);
// Retrieve all Widgets of a user by email
router.get("/:email", widget.findAllOfUser);

// Retrieve a single Widget with widgetId
router.get("/:widgetId", widget.findOne);

// Deploy a Widget with widgetId using netlify
// Update a Widget with widgetId
router.post("/:widgetId", widget.update);

// Delete a Widget with widgetId
router.delete("/:widgetId", widget.remove);
module.exports = router;