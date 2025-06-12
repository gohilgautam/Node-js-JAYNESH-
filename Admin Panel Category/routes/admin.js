const express = require('express');
const route = express.Router();
const upload = require('../middleware/adminMulter');
const passport = require('../config/passportLocalStrategy');

const {
    loginPage,
    lostPasswordPage,
    checkEmail,
    otpVerifyPage,
    newsetpassword,
    checknewpassword,
    dashboard,
    userChecked,
    addAdminPage,
    viewAdminPage,
    insertAdminData,
    editAdmin,
    logout,
    changePassword,
    changemypassword,
    viewProfile,
    updateProfile,
    DeleteAdmin,
    UpdateAdmin,
    editProfile,
    checkOtp
} = require("../controller/adminController");

console.log("Routing...");

route.get('/', passport.checkLostPasswordAuthentication, loginPage);
route.post('/login', passport.authenticate('local-auth', { failureRedirect: '/' }), userChecked);
route.get('/logout', logout);

route.get('/lostPasswordPage', passport.checkLostPasswordAuthentication, lostPasswordPage);
route.post('/verifyOtp', checkEmail);
route.get('/otpVerifyPage', passport.checkLostPasswordAuthentication, otpVerifyPage);
route.post('/checkOtp', checkOtp);
route.get('/newSetPassword', passport.checkLostPasswordAuthentication, newsetpassword);
route.post('/checkNewPassword', checknewpassword);

route.get('/changePassword', passport.checkAuthentication, changePassword);
route.post('/changeMyNewPassword', changemypassword);

route.get('/dashboard', passport.checkAuthentication, dashboard);

route.get('/addAdmin', passport.checkAuthentication, addAdminPage);
route.get('/viewAdmin', passport.checkAuthentication, viewAdminPage);
route.get('/viewProfile', passport.checkAuthentication, viewProfile);
route.get('/updateProfile', passport.checkAuthentication, updateProfile);
route.post('/editProfile', passport.checkAuthentication, upload.single('image'), editProfile);

route.post('/insertAdminData', passport.checkAuthentication, upload.single('avatar'), insertAdminData);
route.get('/deleteAdmin/:delId', passport.checkAuthentication, DeleteAdmin);
route.get('/updateAdmin', passport.checkAuthentication, UpdateAdmin);
route.post('/editAdmin/:editId', passport.checkAuthentication, upload.single('avatar'), editAdmin);

route.use('/category', passport.checkAuthentication, require('./category'));
route.use('/subcategory', passport.checkAuthentication, require('./subcategory'));
route.use('/extracategory', passport.checkAuthentication, require('./extracategory'));
route.use('/product', passport.checkAuthentication, require('./product'));

module.exports = route;
