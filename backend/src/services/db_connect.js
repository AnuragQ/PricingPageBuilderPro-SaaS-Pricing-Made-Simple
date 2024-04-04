const mongoose = require("mongoose");
const config = require("../config/config.js");


// import config from /config/config.js
const dotenv = require("dotenv");
const connectDatabse = () => {mongoose
  .connect(config.db_url, {
    useNewUrlParser: config.db_options.useNewUrlParser,
    useUnifiedTopology: config.db_options.useUnifiedTopology,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
}

module.exports = { connectDatabse };