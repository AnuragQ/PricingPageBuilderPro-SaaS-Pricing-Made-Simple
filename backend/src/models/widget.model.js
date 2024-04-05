const mongoose = require("mongoose");

// - widget_id
// - user_id
// - creation_date
// - updated_at
// - template_id
// - template_meta_data : [
//     {
//         "plan_title":string,
//         "plan_pricing":string,
//         "plan_currency": string,
//         "plan_features_core":[]
//         "plan_features_addons":[]
//         "plan_duration":int
//     },{

//     },..]

const widgetSchema = new mongoose.Schema({
  widget_id: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  payment_button_ids: {
    type: Object,
    default: {},
  },
  code: {
    type: String,
    default: "",
  },
  menubar: {
    type: String,
    default: "",
  },
  success_url: {
    type: String,
    default: "#",
  },
  failure_url: {
    type: String,
    default: "#",
  }, //
  image_url: {
    type: String,
    default: "",
  },
  deployment_url: {
    type: String,
    default: "",
  },
  site_id: {
    type: String,
    default: "",
  },
  currency: {
    type: String,
    default: "usd",
  },
});

module.exports = mongoose.model("Widget", widgetSchema);
