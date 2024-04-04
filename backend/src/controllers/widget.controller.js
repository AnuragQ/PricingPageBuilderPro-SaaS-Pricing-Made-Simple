// load .env variables
require("dotenv").config();
const Widget = require("../models/widget.model");
const Button_Model = require("../models/button.model");
const { ObjectId } = require("mongoose").Types;
const mongoose = require("mongoose");
const fs = require("fs");
const NetlifyAPI = require("netlify");
const JSZip = require("jszip");
const archiver = require("archiver");
const path = require("path"); //
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
  //   console.log(req.body.payment_button_ids);
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
    widget_id: req.body.widget_id || "",
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
    site_id: req.body.site_id || "",
  });

  // Save Widget in the database
  // Save Widget in the database
  try {
    // console.log("Saving widget");

    const savedWidget = await widget.save();

    // console.log("Saved success");

    // Get id of the widget and update the payment_button_ids
    const widget_id = savedWidget._id;

    // Use foreach loop

    // Convert json to array
    const btnsArr = Object.keys(req.body.payment_button_ids).map((key) => {
      return req.body.payment_button_ids[key];
    });

    // console.log(btnsArr);
    // Loop through the payment_button_ids and update the widget_id
    for (let i = 0; i < btnsArr.length; i++) {
      console.log(btnsArr[i]);
      // Convert the string hex string
      const hexString = btnsArr[i];
      console.log("Processing Hex String: ", hexString);

      // Find the button with the field named button_id and update the widget_id
      await Button_Model.findOneAndUpdate(
        { button_id: hexString }, // Use button_id to find the document
        { widget_id: widget_id },
        { new: true }
      );
    }
    res.send(savedWidget);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Widget.",
    });
  }
}

// Retrieve and return all widgets of a particular user emain from the database.
async function findAllOfUser(req, res) {
  Widget.find({ created_by: req.params.email })
    .then((widgets) => {
      data_to_send = [];
      for (let i = 0; i < widgets.length; i++) {
        data_to_send.push({
          widget_id: widgets[i]._id,
          name: widgets[i].name,
          //   created_by: widgets[i].created_by,
          // created_at: widgets[i].created_at,
          updated_at: widgets[i].updated_at,
          // payment_button_ids: widgets[i].payment_button_ids,
          // code: widgets[i].code,
          // menubar: widgets[i].menubar,
          // success_url: widgets[i].success_url,
          // failure_url: widgets[i].failure_url,
          image_url: widgets[i].image_url,
          //   deployment_url: widgets[i].deployment_url,
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
  console.log("Finding widget with id: ");
  Widget.findById(req.params.widgetId)
    .then((widget) => {
      if (!widget) {
        return res.status(404).send({
          message: "Widget not found with id " + req.params.widgetId,
        });
      }
      console.log(widget);
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

function createZipWithHTML(htmlString) {
  // Ensure the 'source' directory exists
  fs.mkdirSync("source", { recursive: true });

  // Write the HTML string to 'source/index.html'
  fs.writeFileSync("source/index.html", htmlString);

  // Create a file to stream archive data to
  let output = fs.createWriteStream("source.zip");
  let archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level
  });

  // Listen for all archive data to be written
  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "Archiver has been finalized and the output file descriptor has closed."
    );
  });

  // Pipe archive data to the file
  archive.pipe(output);

  // Append 'source' directory to the archive
  archive.directory("source/", "source");

  // Finalize the archive
  archive.finalize();
}

async function deploy(req, res) {
  try {
    const widget = await Widget.findOne({ widget_id: req.params.widgetId });
    const code = widget.code;
    const netlifyClient = new NetlifyAPI(process.env.NETLIFY_ACCESS_TOKEN);
    let site_id = widget.site_id;

    if (!site_id) {
      const site_name = widget.name || "widget";
      const site = await netlifyClient.createSite({
        body: {
          name: site_name + "-" + uuidv4(),
        },
      });
      site_id = site.id;
    }
    createZipWithHTML(code);

    // run cli command netlify deploy --dir=source --site=$site_id using child_process
    const { exec } = require("child_process");
    console.log("site_id", site_id);
    exec(
      `netlify deploy --dir=source --site=${site_id} --prod`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        // display stdout line by line and print the line containing "Website URL"
        const lines = stdout.split("\n");
        let deployment_url = "";
        for (const line of lines) {
          console.log(line);
          if (line.includes("Website URL")) {
            deployment_url = line.split(": ")[1];
            console.log("deployment_url==========================", deployment_url);
            break;
          }
        }
        // update the widget with the deployment url
        widget.deployment_url = deployment_url;
        widget.site_id = site_id;
        widget.save();
        res.send({ deployment_url });
        
        console.log("deployment_url", deployment_url.split(" ")[1]);
        console.error(`stderr: ${stderr}`);
      }
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "An error occurred while deploying widget." });
  }
}

module.exports = {
  create,
  findAllOfUser,
  findOne,
  update,
  remove,
  deploy,
};
