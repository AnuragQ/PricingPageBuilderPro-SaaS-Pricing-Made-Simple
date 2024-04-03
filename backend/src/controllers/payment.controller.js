
const payment = require("../models/payment.model");

// Create and Save a new User
async function createCheckoutSession(req, res) {
  return res.status(200).json({ message: "Payment created" });
}


module.exports = {
    createCheckoutSession,
};
