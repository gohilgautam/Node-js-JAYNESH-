const express = require("express");
require("dotenv").config();
const db = require("./config/db");

const app = express();
app.use("/", require("./routes/index.Routes"));

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return false;
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});
