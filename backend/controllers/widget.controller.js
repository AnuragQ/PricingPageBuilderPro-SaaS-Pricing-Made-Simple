const Widget = require('../models/widget.model');

// Create and Save a new Widget
async function create(req, res) {
    // Validate request
    if (!req.body.widget_name) {
        return res.status(400).send({
            message: "Widget widget_name can not be empty"
        });
    }

    // Create a Widget
    const widget = new Widget({
        widget_name: req.body.widget_name,
        widget_description: req.body.widget_description,
        widget_price: req.body.widget_price,
        widget_currency: req.body.widget_currency,
        widget_duration: req.body.widget_duration
    });

    // Save Widget in the database
    widget.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Widget."
            });
        });
}

// Retrieve and return all widgets from the database.
async function findAll(req, res) {
    Widget.find()
        .then(widgets => {
            res.send(widgets);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving widgets."
            });
        });
}

// Find a single widget with a widgetId
async function findOne(req, res) {
    Widget.findById(req.params.widgetId)
        .then(widget => {
            if (!widget) {
                return res.status(404).send({
                    message: "Widget not found with id " + req.params.widgetId
                });
            }
            res.send(widget);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Widget not found with id " + req.params.widgetId
                });
            }
            return res.status(500).send({
                message: "Error retrieving widget with id " + req.params.widgetId
            });
        });
}

// Update a widget identified by the widgetId in the request
async function update(req, res) {
    // Validate Request
    if (!req.body.widget_name) {
        return res.status(400).send({
            message: "Widget widget_name can not be empty"
        });
    }

    // Find widget and update it with the request body
    Widget.findByIdAndUpdate(req.params.widgetId, {
        widget_name: req.body.widget_name,
        widget_description: req.body.widget_description,
        widget_price: req.body.widget_price,
        widget_currency: req.body.widget_currency,
        widget_duration: req.body.widget_duration
    }, { new: true })
        .then(widget => {
            if (!widget) {
                return res.status(404).send({
                    message: "Widget not found with id " + req.params.widgetId
                });
            }
            res.send(widget);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Widget not found with id " + req.params.widgetId
                });
            }
            return res.status(500).send({
                message: "Error updating widget with id " + req.params.widgetId
            });
        });
}

// Delete a widget with the specified widgetId in the request
async function remove(req, res) {
    Widget.findByIdAndRemove(req.params.widgetId)
        .then(widget => {
            if (!widget) {
                return res.status(404).send({
                    message: "Widget not found with id " + req.params.widgetId
                });
            }
            res.send({ message: "Widget deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Widget not found with id " + req.params.widgetId
                });
            }
            return res.status(500).send({
                message: "Could not delete widget with id " + req.params.widgetId
            });
        });
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove
}