const express = require("express");
const router = express.Router();

// include the user controller
const payment = require("../controllers/payment.controller.js");

router.post(
  "/master/create-checkout-session",
  payment.createMasterCheckoutSession
);

// Create a new Payment using stripe
router.post("/create-checkout-session", payment.createCheckoutSession);
// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   payment.webhook
// );

// Get all Payments of a user by email
router.get("/:email", payment.findAll);
module.exports = router;
