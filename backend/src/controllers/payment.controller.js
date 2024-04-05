require("dotenv").config();

// import uuid
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payment.model");
const user_model = require("../models/user.model");
const button_model = require("../models/button.model");
const widget_model = require("../models/widget.model");
// const json = require("json");

// C reate and Save a new User
async function createCheckoutSession(req, res) {
  try {
    // const widget_id = req.body.widget_id;
    // get success and failure urls from the widget using widget_id
    console.log("req.body.items", req.body.items);
    let button_id = req.body.items[0]["id"];
    console.log("button_id", button_id);
    // fetch the button details using button_id
    const button = await button_model.findOne({ button_id: button_id });
    console.log("button", button);
    const widget = await widget_model.findOne({ _id: button.widget_id });
    const sessionItems = await Promise.all(
      req.body.items.map(async (item) => {
        const plan = await button_model.findOne({ button_id: item.id });
        return {
          price_data: {
            currency: plan.currency || "usd",
            product_data: {
              name: plan.label,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        };
      })
    );
    console.log("created_by", widget.created_by);
    // get user details using email passed in the request
    const user = await user_model.findOne({ email: widget.created_by });
    console.log("user", user);
    const stripe = require("stripe")(
      (user && user.stripe_key) || process.env.STRIPE_PRIVATE_KEY
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: sessionItems,
      success_url: `${widget.success_url}`,
      cancel_url: `${widget.failure_url}`,
      metadata: {
        widget_id: widget.widget_id,
      },
    });
    res.json({ url: session.url });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}

async function webhook(req, res) {
  const jsonStr = req.body.toString(); // Get the raw JSON string
  const data = JSON.parse(jsonStr);
  console.log("webhook called", data);
  const metadata = data.data.object.metadata;
  if (!metadata || !metadata.widget_id) {
    return res.status(400).send("No metadata found");
  }
  console.log("widget_id", metadata.widget_id);
  const widget = await widget_model.findOne({ widget_id: metadata.widget_id });
  const user = await user_model.findOne({ email: widget.created_by });
  console.log("user in webhook", user);
  const stripe_key = user.stripe_key || process.env.STRIPE_PRIVATE_KEY;
  const stripe = require("stripe")(stripe_key);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log("event", event.type);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // create a new payment record in the database
    console.log("session", session);
    const payment = new Payment({
      //uuid
      payment_id: uuidv4(),
      session: session,
      widget_id: metadata.widget_id,
      user_email: widget.created_by,
    });

    // Save Payment in the database
    payment
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Payment.",
        });
      });
  }

  res.status(200);
}

// Get all the payments of a user
async function findAll(req, res) {
  try {
    const user = await user_model.findOne({ email: req.params.email });

    // Find all payments of the user
    var payments = await payment.find({ user_email: req.params.email });
    res.send(payments);
  } catch (error) {
    console.log(error);
  }
}

async function masterWebhook(req, res) {
  const jsonStr = req.body.toString(); // Get the raw JSON string
  const data = JSON.parse(jsonStr);
  console.log("webhook called", data);
  const metadata = data.data.object.metadata;
  if (!metadata || !metadata.user_email) {
    return res.status(400).send("No metadata found");
  }

  const user = await user_model.findOne({ email: metadata.user_email });

  const stripe_key = process.env.STRIPE_PRIVATE_KEY;
  const stripe = require("stripe")(stripe_key);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_MASTER_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log("event", event.type);
  if (event.type === "checkout.session.completed") {
    // change the user isPaid to true
    user.isPaid = true;

    user
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Payment.",
        });
      });
  }

  res.status(200);
}

async function createMasterCheckoutSession(req, res) {
  try {
    // const widget_id = req.body.widget_id;
    // get success and failure urls from the widget using widget_id
    console.log("req.body.items", req.body.user_email);

    const user_email = req.body.user_email;
    const sessionItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Premium",
          },
          unit_amount: 299 * 100,
        },
        quantity: 1,
      },
    ];

    // console.log("user", user);
    const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: sessionItems,
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: {
        user_email: user_email,
      },
    });
    res.json({ url: session.url });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  createCheckoutSession,
  webhook,
  findAll,
  createMasterCheckoutSession,
  masterWebhook,
};
