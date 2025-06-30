const express = require("express");
const db = require("./config/db");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes"));


app.listen(PORT, (err) => {
    if (err) {
        return console.error('Error starting server:', err);
    }
  console.log(`Server is running on http://localhost:${PORT}`);
}
);
