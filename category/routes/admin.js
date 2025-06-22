const express = require('express');
const { loginPage, userChecked, logout, losspassword, otpVerify, checkEmail, checkOtp, newsetpassword, checknewpassword, changePassword, changemypassword, DashbordPage, addAdminPage, viewAdminPage, viewProfile, updateProfile, editProfile, insertAdmin, DeleteAdmin, editAdmin, UpdateAdmin } = require('../controllers/adminController');
const Passport = require('../config/passportLocalStrategy');
const upload = require('../middleware/adminMulter');

const route = express.Router();

route.get('/', Passport.checkLostPasswordAuthentication, loginPage);
route.post('/login', Passport.authenticate('local', { failureRedirect: "/" }), userChecked);

//logout
route.get('/logout', logout)

// Password Reset routes
route.get('/lostPassword', Passport.checkLostPasswordAuthentication, losspassword);
route.post('/checkEmail', checkEmail);
route.get('/otpVerify', Passport.checkLostPasswordAuthentication, otpVerify);
route.post('/checkOtp', checkOtp);
route.get('/newsetpassword', Passport.checkLostPasswordAuthentication, newsetpassword);
route.post('/checknewpassword', checknewpassword);

// Password Change routes
route.get('/changePassword', Passport.checkAuthentication, changePassword);
route.post('/changemypassword', Passport.checkAuthentication, changemypassword);

// Dashboard
route.get('/dashboard', Passport.checkAuthentication, DashbordPage);

// Admin management
route.get('/addAdmin', Passport.checkAuthentication, addAdminPage);
route.get('/viewAdmin', Passport.checkAuthentication, viewAdminPage);
route.get('/viewProfile', Passport.checkAuthentication, viewProfile);
route.get('/updateProfile', Passport.checkAuthentication, updateProfile);
route.post('/editProfile', Passport.checkAuthentication, upload.single('avatar'), editProfile);

// CRUD
route.post('/insert', Passport.checkAuthentication, upload.single('avatar'), insertAdmin);
route.get('/deleteAdmin/:id', Passport.checkAuthentication, DeleteAdmin);

route.get('/updateAdmin', Passport.checkAuthentication, UpdateAdmin);
route.post('/editAdmin/:editId', Passport.checkAuthentication, upload.single('avatar'), editAdmin);


route.use('/category', Passport.checkAuthentication, require('./category'));
route.use('/subcategory', Passport.checkAuthentication, require('./subCategory'));
route.use('/extracategory', Passport.checkAuthentication, require('./extraCategory'));
route.use('/product', Passport.checkAuthentication, require('./products'));

module.exports = route;