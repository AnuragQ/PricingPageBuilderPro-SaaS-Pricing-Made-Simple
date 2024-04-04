const express = require("express");
const router = express.Router();

// include the user controller
const payment = require("../controllers/payment.controller.js");

// Create a new Payment using stripe
router.post("/create-checkout-session", payment.createCheckoutSession);
router.post("/webhook", payment.webhook);
module.exports = router;