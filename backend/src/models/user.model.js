const mongoose = require("mongoose");
// - user_id
// - username: string
// - email: string
// - created_date: datetime
// - widget : Array
const User = new mongoose.Schema({
  // user id is uuid
  user_id: {
    type: String,
    // required: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  widget: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  stripe_key: {
    type: String,
    default: "",
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  stripe_webhook: {
    type: String,
    default: "",
  },
});
//
module.exports = mongoose.model("User", User);
