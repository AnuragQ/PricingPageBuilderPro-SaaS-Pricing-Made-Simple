const Widget = require("../models/widget.model");
const Widget = require("../models/widget.model");
const Button_Model = require("../models/button.model");

const { v4: uuidv4 } = require("uuid");
// model has below fields
// - name
// - widget_id
// - created_by
// - created_at
// - updated_at
// - payment_button_ids
// - code
// - menubar
// - success_url
// - failure_url
// - image_url
// - deployment_url

// Create and Save a new Widget
async function create(req, res) {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: "Widget widget_name can not be empty",
    });
  }

  if (!req.body.created_by) {
    return res.status(400).send({
      message: "Widget created_by can not be empty",
    });
  }

  // Create a Widget
  const widget = new Widget({
    // widget id is auto generated uuid
    widget_id: req.body.widget_id || uuidv4(),
    name: req.body.name,
    created_by: req.body.created_by,
    created_at: req.body.created_at || Date.now(),
    updated_at: req.body.updated_at || Date.now(),

    payment_button_ids: req.body.payment_button_ids || {},

    code: req.body.code || "",
    menubar: req.body.menubar || "",
    success_url: req.body.success_url || "",
    failure_url: req.body.failure_url || "",
    image_url: req.body.image_url || "",
    deployment_url: req.body.deployment_url || "",
  });

  // Save Widget in the database
  widget
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Widget.",
      });
    });
}

// Retrieve and return all widgets of a particular user emain from the database.
async function findAllOfUser(req, res) {
  Widget.find({ created_by: req.params.email })
    .then((widgets) => {
      data_to_send = [];
      for (let i = 0; i < widgets.length; i++) {
        data_to_send.push({
          widget_id: widgets[i].widget_id,
          name: widgets[i].name,
          created_by: widgets[i].created_by,
          // created_at: widgets[i].created_at,
          // updated_at: widgets[i].updated_at,
          // payment_button_ids: widgets[i].payment_button_ids,
          // code: widgets[i].code,
          // menubar: widgets[i].menubar,
          // success_url: widgets[i].success_url,
          // failure_url: widgets[i].failure_url,
          image_url: widgets[i].image_url,
          deployment_url: widgets[i].deployment_url,
        });
      }
      res.send(data_to_send);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving widgets.",
      });
    });
}

// Find a single widget with a widgetId
async function findOne(req, res) {
  Widget.findById(req.params.widgetId)
    .then((widget) => {
      if (!widget) {
        return res.status(404).send({
          message: "Widget not found with id " + req.params.widgetId,
        });
      }
      res.send(widget);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Widget not found with id " + req.params.widgetId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving widget with id " + req.params.widgetId,
      });
    });
}

// Update a widget identified by the widgetId in the request
async function update(req, res) {
  // build dictionary of fields to be updated by checking if they are present in the request body
  let updateFields = {};
  if (req.body.name) {
    updateFields["name"] = req.body.name;
  }
  updateFields["updated_at"] = Date.now();
  if (req.body.payment_button_ids) {
    updateFields["payment_button_ids"] = req.body.payment_button_ids;
  }
  if (req.body.code) {
    updateFields["code"] = req.body.code;
  }
  if (req.body.menubar) {
    updateFields["menubar"] = req.body.menubar;
  }
  if (req.body.success_url) {
    updateFields["success_url"] = req.body.success_url;
  }
  if (req.body.failure_url) {
    updateFields["failure_url"] = req.body.failure_url;
  }
  if (req.body.image_url) {
    updateFields["image_url"] = req.body.image_url;
  }
  if (req.body.deployment_url) {
    updateFields["deployment_url"] = req.body.deployment_url;
  }

  // Find widget and update it with the request body
  Widget.findByIdAndUpdate(req.params.widgetId, updateFields, { new: true });
}

// Delete a widget with the specified widgetId in the request
async function remove(req, res) {
  Widget.findByIdAndRemove(req.params.widgetId)
    .then((widget) => {
      if (!widget) {
        return res.status(404).send({
          message: "Widget not found with id " + req.params.widgetId,
        });
      }
      res.send({ message: "Widget deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Widget not found with id " + req.params.widgetId,
        });
      }
      return res.status(500).send({
        message: "Could not delete widget with id " + req.params.widgetId,
      });
    });
}

module.exports = {
  create,
  findAllOfUser,
  findOne,
  update,
  remove,
};
