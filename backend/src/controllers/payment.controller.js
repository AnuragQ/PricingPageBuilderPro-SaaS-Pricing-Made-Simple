require("dotenv").config();

// import uuid
const { v4: uuidv4 } = require("uuid");
const payment = require("../models/payment.model");
const user_model = require("../models/user.model");
const button_model = require("../models/button.model");
const widget_model = require("../models/widget.model");

// C reate and Save a new User
async function createCheckoutSession(req, res) {
  try {
    // get user details using email passed in the request
    const user = await user_model.findOne({ email: req.body.email });

    const stripe = require("stripe")(
      (user && user.stripe_key) || process.env.STRIPE_PRIVATE_KEY
    );
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: sessionItems,
      success_url: `${widget.success_url}`,
      cancel_url: `${widget.failure_url}`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}

async function webhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // create a new payment record in the database
    const payment = new Payment({
      //uuid
      payment_id: uuidv4(),
      session: session,
    });

    // Save Payment in the database
    payment
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Payment.",
        });
      });
  }

  res.status(200);
}
module.exports = {
  createCheckoutSession,
  webhook,
};
