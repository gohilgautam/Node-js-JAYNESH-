const express = require("express");
const db = require("./config/db");

const app = express();
const PORT = 9000;

app.use("/", require("./routes/index"));

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return false;
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
