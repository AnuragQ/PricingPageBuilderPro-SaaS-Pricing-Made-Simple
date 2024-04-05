const Button = require("../models/button.model");

// label: string
// price: number
// currency: string
const { v4: uuidv4 } = require("uuid");

// cr eate and save multiple buttons passed as an array in the request body
async function create(req, res) {
  // Validate request
  if (!req.body.buttons) {
    return res.status(400).send({
      message: "Button content can not be empty",
    });
  }
  for (let i = 0; i < req.body.buttons.length; i++) {
    if (!req.body.buttons[i].label) {
      return res.status(400).send({
        message: "Button label can not be empty",
      });
    }
    if (!req.body.buttons[i].price) {
      return res.status(400).send({
        message: "Button price can not be empty",
      });
    }
    if (!req.body.buttons[i].currency) {
      return res.status(400).send({
        message: "Button currency can not be empty",
      });
    }
  }
  // create and save multiple buttons and return button_ids as an array in response
  try {
    const buttonIds = {};
    for (const buttonData of req.body.buttons) {
      const button = new Button({
        button_id: uuidv4(),
        label: buttonData.label,
        price: buttonData.price,
        currency: buttonData.currency,
      });
      const savedButton = await button.save();
      buttonIds[savedButton.label] = savedButton.button_id;
    }
    res.status(201).send({ button_ids: buttonIds });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Buttons.",
    });
  }
}

// Retrieve and return button from database using button_id
async function findOne(req, res) {
  Button.findOne({ button_id: req.params.button_id })
    .then((button) => {
      if (!button) {
        return res.status(404).send({
          message: "Button not found with id " + req.params.button_id,
        });
      }
      res.send(button);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Button not found with id " + req.params.button_id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving button with id " + req.params.button_id,
      });
    });
}
async function updateOne(req, res) {
  //only update the fields that are passed in the request body
  toUpdate = {};
  if (req.body.label) {
    toUpdate.label = req.body.label;
  }
  if (req.body.price) {
    toUpdate.price = req.body.price;
  }
  if (req.body.currency) {
    toUpdate.currency = req.body.currency;
  }
  if (req.body.widget_id) {
    toUpdate.widget_id = req.body.widget_id;
  }

  Button.findOneAndUpdate(req.params.button_id, toUpdate, { new: true })
    .then((button) => {
      if (!button) {
        return res.status(404).send({
          message: "Button not found with id " + req.params.button_id,
        });
      }
      res.send(button);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Button not found with id " + req.params.button_id,
        });
      }
      return res.status(500).send({
        message: "Error updating button with id " + req.params.button_id,
      });
    });
}
module.exports = {
  create,
  findOne,
  updateOne,
};
