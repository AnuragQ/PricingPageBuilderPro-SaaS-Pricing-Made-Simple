const express = require("express");
const app = express();
const config = require("./src/config/config.js");
const userRoutes = require("./src/routes/User.routes.js");
const widgetRoutes = require("./src/routes/widget.routes.js");
const templateRoutes = require("./src/routes/Template.routes.js");
const paymentRoutes = require("./src/routes/payment.routes.js");
const buttonRoutes = require("./src/routes/button.routes.js");
const cors = require("cors");
const { connectDatabse } = require("./src/services/db_connect.js");
const payment = require("./src/controllers/payment.controller.js");
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  payment.webhook
);
app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server Working!");
});

app.use("/api/users", userRoutes);
app.use("/api/widgets", widgetRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/buttons", buttonRoutes);
app.use((req, res) => {
  res.status(404).send({ message: "URL not found" });
});
app.listen(config.port, () => {
  console.log("Server is running on port 3000");
});

connectDatabse();
