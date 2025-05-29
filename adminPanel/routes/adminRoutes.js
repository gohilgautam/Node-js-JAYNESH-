// const express = require('express');
// const multer = require('multer');
// const path = require('path');

// const router = express.Router();

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // Import controller functions
// const {
//   signInPage,
//   adminChecked,
//   lostpasswordpage,
//   lostpasswordforcheckemail,
//   otpVerifyPage,
//   verifyOTP,
//   setNewPasswordPage,
//   checkNewPassword,
//    changePasswordPage,
//    changePassword,
//   dashboard,
//   addAdminPage,
//   adminTable,
//   viewProfile,
//   logout,
//   adminInsert,
//   editAdminPage,
//   updateAdmin,
//   deleteAdmin,
// } = require('../controllers/adminCTR');

// // Auth Routes
// router.get('/', signInPage);
// router.get('/signInPage', signInPage);
// router.post('/signIn', adminChecked);
// router.get('/signUpPage', addAdminPage); // If you have a signup page

// // Password Recovery Routes
// router.get('/lostpasswordpage', lostpasswordpage);
// router.post('/checkEmail', lostpasswordforcheckemail);
// router.get('/otpVerifyPage', otpVerifyPage);
// router.post('/verifyOTP', verifyOTP);
// router.get('/auth/setNewPasswordPage', setNewPasswordPage);
// router.post('/checkNewPassword', checkNewPassword);


// router.get('/changePasswordPage', changePasswordPage);
// router.post('/changePassword', changePassword);

// // Dashboard
// router.get('/dashboard', dashboard);

// // Admin Profile & Logout
// router.get('/viewProfile', viewProfile);
// router.get('/logout', logout);

// // Admin Management (CRUD)
// router.get('/addAdminPage', addAdminPage);
// router.post('/insertAdmin', upload.single('adminImage'), adminInsert);
// router.get('/adminTable', adminTable);
// router.get('/editAdmin/:id', editAdminPage);
// router.post('/updateAdmin/:id', upload.single('adminImage'), updateAdmin);
// router.get('/deleteAdmin/:deleteId', deleteAdmin);

// module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const adminCTR = require('../controllers/adminCTR');

router.get('/', adminCTR.signInPage);
router.get('/signInPage', adminCTR.signInPage);
router.post('/signIn', adminCTR.adminChecked);

router.get('/lostpasswordpage', adminCTR.lostpasswordpage);
router.post('/checkEmail', adminCTR.lostpasswordforcheckemail);
router.get('/otpVerifyPage', adminCTR.otpVerifyPage);
router.post('/verifyOTP', adminCTR.verifyOTP);
router.get('/auth/setNewPasswordPage', adminCTR.setNewPasswordPage);
router.post('/checkNewPassword', adminCTR.checkNewPassword);

router.get('/changePasswordPage', adminCTR.changePasswordPage);
router.post('/changePassword', adminCTR.changePassword);

router.get('/dashboard', adminCTR.dashboard);
router.get('/viewProfile', adminCTR.viewProfile);
router.get('/logout', adminCTR.logout);

router.get('/addAdminPage', adminCTR.addAdminPage);
router.post('/insertAdmin', upload.single('adminImage'), adminCTR.adminInsert);
router.get('/adminTable', adminCTR.adminTable);
router.get('/editAdmin/:id', adminCTR.editAdminPage);
router.post('/updateAdmin/:id', upload.single('adminImage'), adminCTR.updateAdmin);
router.get('/deleteAdmin/:deleteId', adminCTR.deleteAdmin);

module.exports = router;

