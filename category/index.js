const express = require('express');
const db = require('./config/db');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();
const port = 9000;
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('images'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: '8799125274',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

app.use('/', require('./routes/admin'));

app.listen(port, () => {
    console.log('server is started....');
});