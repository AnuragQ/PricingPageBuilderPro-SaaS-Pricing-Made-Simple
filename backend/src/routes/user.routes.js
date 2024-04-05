const express = require("express");
const router = express.Router();

// include the user controller
const user = require("../controllers/user.controller.js");

// Create a new User
router.post("/", user.create);

// Retrieve all Users
router.get("/", user.findAll);

// Is user paid?
router.get("/paid/:userId", user.isUserPaid);

// Update stripe customer id
router.put("/stripe/:userId", user.updateStripeKey);

// update stripe webhook
router.put("/stripe-webhook/:userId", user.updateStripeWebhook);

// Retrieve a single User with userId
router.get("/:userId", user.findOne);

// Update a User with userId
router.put("/:userId", user.update);

// Delete a User with userId
router.delete("/:userId", user.remove);

module.exports = router;
