const express = require('express');
const db = require('./config/db')

const app = express();

const PORT = 9000;

app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes/userRoutes"));

app.listen(PORT, (err) => {
    if (err) {
        console.log("Server is not connected.....!", err);
        return false;
    }
    console.log(`Server is ready to connected.....! http://localhost:${PORT}`);
}); 