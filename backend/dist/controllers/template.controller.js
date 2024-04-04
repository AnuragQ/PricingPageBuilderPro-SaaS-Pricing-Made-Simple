const Template = require('../models/template.model');

// Create and Save a new Template
async function create(req, res) {
  // Validate request
  if (!req.body.plan_title || !req.body.plan_description || !req.body.template_image || !req.body.template_code || !req.body.review_form_data) {
    return res.status(400).send({
      message: "All fields are required!"
    });
  }
  const template = new Template({
    plan_title: req.body.plan_title,
    plan_description: req.body.plan_description,
    template_image: req.body.template_image,
    template_code: req.body.template_code,
    review_form_data: req.body.review_form_data
  });

  // // Create a Template
  // const template = new Template({
  //     plan_title: req.body.plan_title,
  //     plan_pricing: req.body.plan_pricing,
  //     plan_currency: req.body.plan_currency,
  //     plan_features_core: req.body.plan_features_core,
  //     plan_features_addons: req.body.plan_features_addons,
  //     plan_duration: req.body.plan_duration
  // });

  // Save Template in the database
  template.save().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Template."
    });
  });
}

// Retrieve and return all templates from the database.
async function findAll(req, res) {
  Template.find().then(templates => {
    res.send(templates);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving templates."
    });
  });
}

// Find a single template with a templateId
async function findOne(req, res) {
  Template.findById(req.params.templateId).then(template => {
    if (!template) {
      return res.status(404).send({
        message: "Template not found with id " + req.params.templateId
      });
    }
    res.send(template);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Template not found with id " + req.params.templateId
      });
    }
    return res.status(500).send({
      message: "Error retrieving template with id " + req.params.templateId
    });
  });
}

// update a template identified by the templateId in the request
async function update(req, res) {
  // Validate Request
  if (!req.body.plan_title) {
    return res.status(400).send({
      message: "Template plan_title can not be empty"
    });
  }

  // Find template and update it with the request body
  Template.findByIdAndUpdate(req.params.templateId, {
    plan_title: req.body.plan_title,
    plan_pricing: req.body.plan_pricing,
    plan_currency: req.body.plan_currency,
    plan_features_core: req.body.plan_features_core,
    plan_features_addons: req.body.plan_features_addons,
    plan_duration: req.body.plan_duration
  }, {
    new: true
  }).then(template => {
    if (!template) {
      return res.status(404).send({
        message: "Template not found with id " + req.params.templateId
      });
    }
    res.send(template);
  }).catch(err => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Template not found with id " + req.params.templateId
      });
    }
    return res.status(500).send({
      message: "Error updating template with id " + req.params.templateId
    });
  });
}

// Delete a template with the specified templateId in the request
async function remove(req, res) {
  Template.findByIdAndRemove(req.params.templateId).then(template => {
    if (!template) {
      return res.status(404).send({
        message: "Template not found with id " + req.params.templateId
      });
    }
    res.send({
      message: "Template deleted successfully!"
    });
  }).catch(err => {
    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "Template not found with id " + req.params.templateId
      });
    }
    return res.status(500).send({
      message: "Could not delete template with id " + req.params.templateId
    });
  });
}
module.exports = {
  create,
  findAll,
  findOne,
  update,
  remove
};