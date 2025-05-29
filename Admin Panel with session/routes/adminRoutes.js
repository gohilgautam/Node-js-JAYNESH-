const express = require('express');
const multer = require('multer');
const path = require('path');
const passport = require("passport");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Import controller functions
const {
  signInPage,
  adminChecked,
  lostpasswordpage,
  lostpasswordforcheckemail,
  otpVerifyPage,
  verifyOTP,
  setNewPasswordPage,
  checkNewPassword,
  changePasswordPage,
  changePassword,
  dashboard,
  addAdminPage,
  adminTable,
  viewProfile,
  logout,
  adminInsert,
  editAdminPage,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminCTR');

// Auth Routes
router.get('/', passport.checkLostPasswordAuthentication, signInPage);
router.get('/signInPage', signInPage);
router.post('/signIn', passport.authenticate("local-auth", { failureRedirect: "/" }), adminChecked);
router.get('/signUpPage', addAdminPage); // Optional signup route

// Password Recovery Routes
router.get('/lostpasswordpage', passport.checkLostPasswordAuthentication, lostpasswordpage);
router.post('/checkEmail', lostpasswordforcheckemail);
router.get('/otpVerifyPage', passport.checkLostPasswordAuthentication, otpVerifyPage);
router.post('/verifyOTP', verifyOTP);

// Set New Password after OTP
router.get('/auth/setNewPasswordPage', passport.checkLostPasswordAuthentication, setNewPasswordPage);
router.post('/checkNewPassword', checkNewPassword);

// Change Password for logged-in user
router.get('/auth/changePasswordPage', passport.checkAuthentication, changePasswordPage);
router.post('/changePassword', changePassword);

// Dashboard
router.get('/dashboard', passport.checkAuthentication, dashboard);

// Admin Profile & Logout
router.get('/viewProfile', passport.checkAuthentication, viewProfile);
router.get('/logout', logout);

// Admin Management (CRUD)
router.get('/addAdminPage', passport.checkAuthentication, addAdminPage);
router.post('/insertAdmin', passport.checkAuthentication, upload.single('adminImage'), adminInsert);
router.get('/adminTable', passport.checkAuthentication, adminTable);
router.get('/editAdmin/:id', passport.checkAuthentication, editAdminPage);
router.post('/updateAdmin/:id', passport.checkAuthentication, upload.single('adminImage'), updateAdmin);
router.get('/deleteAdmin/:deleteId', passport.checkAuthentication, deleteAdmin);

module.exports = router;
