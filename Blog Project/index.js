const express = require('express');
require("dotenv").config()
const db = require('./config/db');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/admin", require("./routes/admin.route"));
app.use("/user", require("./routes/user.route"));


app.listen(process.env.PORT, (e) => {
    if (e) {
        console.log("your server is not is started", e);
        return false;
    }
    console.log("your sever is started", process.env.PORT);
}
);