const express = require("express");
const router = express.Router();
const template = require("../controllers/template.controller.js");

// Create a new Template
router.post("/", template.create);

// Retrieve all Templates
router.get("/", template.findAll);

// Retrieve a single Template with templateId
router.get("/:templateId", template.findOne);

// Update a Template with templateId
router.put("/:templateId", template.update);

// Delete a Template with templateId
router.delete("/:templateId", template.remove);
module.exports = router;