const express = require("express");
const router = express.Router();

const widget = require("../controllers/widget.controller.js");

// Create a new Widget
router.post("/", widget.create);
// console.log("widget.routes.js");
router.post("/deploy/:widgetId", widget.deploy);
// Retrieve all Widgets of a user by email
router.get("/findOne/:widgetId", widget.findOne);

router.get("/:email", widget.findAllOfUser);

// Retrieve a single Widget with widgetId

// Deploy a Widget with widgetId using netlify

// Delete a Widget with widgetId
router.delete("/delete/:widgetId", widget.remove);

// Update a Widget with widgetId
router.post("/:widgetId", widget.update);

module.exports = router;
