const express = require('express');
const db = require('./config/db');
const path = require('path')

const app = express();
const port = 8888;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/', require('./routes/index'))

app.listen(port, (err) => {
    if (err) {
        console.log("Server is not connected😡😡😡.....!", err);
        return false;
    }
    console.log(`Server is ready to connected😇😇😇.....! http://localhost:${port}`);
});