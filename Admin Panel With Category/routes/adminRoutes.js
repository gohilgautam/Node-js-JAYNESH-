const express = require('express');
const multer = require('multer');
const passport = require("passport");

const router = express.Router();

// Multer setup for file uploads
const upload = require("../middleware/adminMiddleware");

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
  editAdmin,
  updateAdmin,
  deleteAdmin,
} = require('../controllers/adminCTR');

// Auth Routes
router.get('/', passport.checkLostPasswordAuthentication, signInPage);
router.get('/signInPage', signInPage);
router.post('/signIn', passport.authenticate("local-auth", { failureRedirect: "/" }), adminChecked);

// Password Recovery Routes
router.get('/lostpasswordpage', passport.checkLostPasswordAuthentication, lostpasswordpage);
router.post('/checkEmail', lostpasswordforcheckemail);
router.get('/otpVerifyPage', passport.checkLostPasswordAuthentication, otpVerifyPage);
router.post('/verifyOTP', verifyOTP);

// Set New Password after OTP
router.get('/auth/setNewPasswordPage', passport.checkLostPasswordAuthentication, setNewPasswordPage);
router.post('/checkNewPassword', checkNewPassword);

// Change Password for logged-in user
router.get('/changePasswordPage', passport.checkAuthentication, changePasswordPage);
router.post('/changePassword', changePassword);

// Dashboard
router.get('/dashboard', passport.checkAuthentication, dashboard);

// Admin Profile & Logout
router.get('/viewProfile', passport.checkAuthentication, viewProfile);
router.get('/logout', logout);

// Admin Management (CRUD)
router.get('/admin/addAdminPage', passport.checkAuthentication, addAdminPage);
router.post('/insertAdmin', passport.checkAuthentication, upload.single('adminImage'), adminInsert);
router.get('/admin/adminTable', passport.checkAuthentication, adminTable);
router.get('/admin/editAdmin/:id', passport.checkAuthentication, editAdminPage);
router.post('/editAdmin', passport.checkAuthentication, upload.single('adminImage'), editAdmin);
router.post('/updateAdmin/:id', passport.checkAuthentication, upload.single('adminImage'), updateAdmin);
router.get('/deleteAdmin/:deleteId', passport.checkAuthentication, deleteAdmin);


router.use("/category", passport.checkAuthentication, require("./category"));
router.use(
  "/subcategory",
  passport.checkAuthentication,
  require("./subcategory")
);
router.use(
  "/extracategory",
  passport.checkAuthentication,
  require("./extracategory")
);

router.use("/product", passport.checkAuthentication, require("./product"));


module.exports = router;
