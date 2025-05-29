const express = require('express');
const db = require('./config/db');
const cookieParser = require('cookie-parser');

const session = require("express-session");
const passport = require("passport");
const localStrategy = require("./config/passportLocalStrategy");

const flash = require("connect-flash");

const app = express();
const port = 8080;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(flash());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: "Admin",
        secret: "8799125274", // main session ID
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 100*10*10*60, // 600000 ms => 10 minutes
        },
    })
);

app.use(passport.session());
app.use(passport.initialize());
app.use(passport.currentAdmin);

app.use('/', require('./routes/adminRoutes'));

app.listen(port, (err) => {
    if (err) {
        console.log("Something Went Wrong In Server...", err);
    } else {
        console.log(`Server is Started At http://localhost:${port}`);
    }
});
