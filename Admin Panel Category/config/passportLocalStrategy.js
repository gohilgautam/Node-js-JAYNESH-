const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const admin = require('../model/AdminModel');

passport.use('local-auth', new localStrategy({
    usernameField: "email",
}, async function (email, password, done) {
    console.log(`email : ${email} , password : ${password}`);

    const adminData = await admin.findOne({ email: email }); // null

    if (adminData) {
        if (adminData.password == password) {
            console.log(`Login Successfully....`);
            return done(null, adminData);
        } else {
            console.log(`Wrong Password....`);
            return done(null, false); 
        }
    } else {
        console.log(`Wrong Email....`);
        return done(null, false);
    }
}));


passport.serializeUser(function (admin, done) {
    console.log("Seriallize is called....");
    return done(null, admin.id);
})

passport.deserializeUser(async function (id, done) {
    console.log("Deseriallize is called....");
    try {
        const authAdmin = await admin.findById(id);
        if (authAdmin) {
            return done(null, authAdmin);
        } else {
            console.log("User not found during deserialization.");
            return done(null, false); 
        }
    } catch (err) {
        console.error("Error during deserialization:", err);
        return done(err); 
    }
});


// Check Login MiddleWare
passport.checkAuthentication = function (req, res, next) {
    console.log("Auth Middleware is called....");

    console.log("Auth : ", req.isAuthenticated());

    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

// Lost Password
passport.checkLostPasswordAuthentication = function (req, res, next) {
    console.log("Auth Middleware is called....");

    console.log("Auth : ", req.isAuthenticated());

    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

// currentAdmin Data
passport.currentAdmin = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.currentAdmin = req.user;
        next();
    } else {
        next();
    }
}

module.exports = passport;