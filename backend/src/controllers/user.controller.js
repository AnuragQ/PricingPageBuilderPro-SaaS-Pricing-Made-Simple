const User = require("../models/user.model");

// Create and Save a new User
async function create(req, res) {
  // Validate request
  if (!req.body.email) {
    return res.status(400).send({
      message: "User email cannot be empty",
    });
  }
  //
  // Create a User
  const user = new User({
    email: req.body.email,
  });

  // Save User in the database
  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
}

// Retrieve and return all users from the database.
async function findAll(req, res) {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
}

// Find a single user with a userId
async function findOne(req, res) {
  // Find user by email
  User.findOne({ email: req.params.userId })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.userId,
      });
    });
}

// Update a user identified by the userId in the request
async function update(req, res) {
  // Validate Request
  if (!req.body.username) {
    return res.status(400).send({
      message: "User username can not be empty",
    });
  }

  // Find user and update it with the request body
  User.findByIdAndUpdate(
    req.params.userId,
    {
      user_id: req.body.user_id || "0",
      username: req.body.username,
      email: req.body.email,
      created_date: req.body.created_date || Date.now(),
      widget: req.body.widget,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      return res.status(500).send({
        message: "Error updating user with id " + req.params.userId,
      });
    });
}

async function updateStripeKey(req, res) {
  // Validate Request
  if (!req.body.stripe_key) {
    return res.status(400).send({
      message: "Stripe key can not be empty",
    });
  }

  // Find user by email and update it with the request body
  const user = await User.findOne({ email: req.params.userId });
  if (!user) {
    return res.status(404).send({
      message: "User not found with id " + req.params.userId,
    });
  }

  user.stripe_key = req.body.stripe_key;
  const newUser = await user.save();

  // Send response
  res.send(newUser);
}

async function updateStripeWebhook(req, res) {
  // Validate Request
  if (!req.body.stripe_webhook) {
    return res.status(400).send({
      message: "Stripe webhook can not be empty",
    });
  }

  // Find user by email and update it with the request body
  const user = await User.findOne({ email: req.params.userId });
  if (!user) {
    return res.status(404).send({
      message: "User not found with id " + req.params.userId,
    });
  }

  user.stripe_webhook = req.body.stripe_webhook;
  const newUser = await user.save();

  // Send response
  res.send(newUser);
}

// Delete a user with the specified userId in the request
async function remove(req, res) {
  User.findByIdAndRemove(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "User not found with id " + req.params.userId,
        });
      }
      return res.status(500).send({
        message: "Could not delete user with id " + req.params.userId,
      });
    });
}

async function isUserPaid(req, res) {
  try {
    // Find user
    const user = await User.findOne({ email: req.params.userId });
    if (!user) {
      return res.status(404).send({
        message: "User not found with id " + req.params.userId,
      });
    }
    // Send response if user is paid
    res.send(user.isPaid);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove,
  updateStripeKey,
  isUserPaid,
  updateStripeWebhook,
};
