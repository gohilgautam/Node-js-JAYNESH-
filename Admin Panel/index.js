const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./config/Database');
const route = require('./routes/index');

const app = express();
const port = 9000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', route);

// Start server
app.listen(port, (err) => {
    if (err) {
        console.log("Server is not connected.....!", err);
        return false;
    }
    console.log(`Server is ready to connected.....! http://localhost:${port}`);
});
