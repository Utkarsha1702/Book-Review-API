const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/bookRoutes")); // secure routes here

module.exports = app;
