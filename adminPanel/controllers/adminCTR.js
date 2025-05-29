const adminDetails = require('../models/adminModel');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Render sign-in page
const signInPage = (req, res) => {
  if (!req.cookies.admin) return res.render('signInPage');
  res.redirect('/dashboard');
};

// Check credentials
const adminChecked = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;
  const admin = await adminDetails.findOne({ adminEmail });
  if (admin && admin.adminPassword === adminPassword) {
    res.cookie('admin', { _id: admin._id });
    return res.redirect('/dashboard');
  }
  res.redirect('/signInPage');
};

// Forgot Password Pages
const lostpasswordpage = (req, res) => res.render('auth/lostpasswordpage');
const otpVerifyPage = (req, res) => res.render('auth/otpVerifyPage');
const setNewPasswordPage = (req, res) => res.render('auth/setNewPasswordPage');

// Check email and send OTP
const lostpasswordforcheckemail = async (req, res) => {
  const email = req.body.resetEmail;
  const admin = await adminDetails.findOne({ adminEmail: email });

  if (!admin) return res.redirect('/lostpasswordpage');

  const OTP = Math.floor(100000 + Math.random() * 900000);
  res.cookie('OTP', OTP);
  res.cookie('resetEmail', email);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gohilgautam2406@gmail.com',
      pass: 'yhliwejqeabrdmqf',
    },
  });

  await transporter.sendMail({
    from: '"Admin Panel" <gohilgautam2406@gmail.com>',
    to: email,
    subject: 'Password Reset OTP',
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Confirmation</title>
    <style>
      /* Base Reset */
      body {
        margin: 0;
        padding: 0;
        font-family: Inter, Arial, sans-serif;
        background-color: #fafafa;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }
      p {
        font-size: 16px;
        margin: 0 0 12px;
      }

      /* Hidden Preheader */
      .preheader {
        display: none;
        font-size: 1px;
        color: #ffffff;
        line-height: 1px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
      }

      /* Wrapper Styles */
      .email-wrapper {
        background-color: #fafafa;
        word-spacing: normal;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 16px;
      }

      .email-box {
        background-color: #ffffff;
        border-radius: 8px;
        max-width: 568px;
        margin: 0 auto;
        padding: 32px;
        text-align: center;
      }

      .logo {
        width: 180px;
        margin: 0 auto 24px;
      }

      .heading {
        font-size: 24px;
        font-weight: bold;
        color: #000;
        margin: 16px 0;
      }

      .message {
        font-size: 16px;
        color: #000;
        margin-bottom: 24px;
      }

      .otp-container {
        background-color: #ebe3ff;
        border-radius: 8px;
        padding: 16px;
        max-width: 250px;
        margin: 0 auto 16px;
      }

      .otp {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 16px;
        color: #000000;
        margin: 0;
      }

      .footer {
        font-size: 13px;
        color: #555;
        margin-top: 16px;
      }

      @media only screen and (max-width: 480px) {
        .container,
        .email-box {
          width: 100% !important;
        }
        .otp-container {
          max-width: 100% !important;
        }
        .otp {
          font-size: 28px;
          letter-spacing: 8px;
        }
      }
    </style>
  </head>
  <body class="email-wrapper">
    <!-- Hidden Preheader -->
    <div class="preheader">OTP for email confirmation</div>

    <!-- Email Body -->
    <table class="container" align="center" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td>
          <div class="email-box">
            <!-- Logo -->
            <img
              class="logo"
              src="https://i.imghippo.com/files/xZkvY1724649505.png"
              alt="Company Logo"
            />

            <!-- Heading -->
            <h1 class="heading">Please confirm your email</h1>

            <!-- Message -->
            <p class="message">
              Use this code to confirm your email and complete signup.
            </p>

            <!-- OTP Box -->
            <div class="otp-container">
              <p>Your OTP is: <b>${OTP}</b></p> 
            </div>

            <!-- Footer -->
            <p class="footer">This code is valid for 15 minutes.</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`
  });

  res.redirect('/otpVerifyPage');
};

// Verify OTP
const verifyOTP = (req, res) => {
  if (req.body.OTP == req.cookies.OTP) {
    return res.redirect('/auth/setNewPasswordPage');
  }
  res.redirect('/otpVerifyPage');
};

// Check and set new password
const checkNewPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.cookies.resetEmail;

  if (newPassword !== confirmPassword) return res.redirect('/auth/setNewPasswordPage');

  await adminDetails.findOneAndUpdate({ adminEmail: email }, { adminPassword: newPassword });

  res.clearCookie('OTP');
  res.clearCookie('resetEmail');
  res.redirect('/signInPage');
};

// Change password from profile
const changePasswordPage = (req, res) => {
  if (!req.cookies.admin) return res.redirect('/signInPage');
  res.render('auth/changePasswordPage');
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const admin = await adminDetails.findById(req.cookies.admin._id);

  if (!admin || admin.adminPassword !== oldPassword) return res.send("Invalid old password.");
  if (newPassword !== confirmPassword) return res.send("Passwords do not match.");

  admin.adminPassword = newPassword;
  await admin.save();
  res.redirect('/dashboard');
};

// Dashboard
const dashboard = (req, res) => {
  if (!req.cookies.admin) return res.redirect('/signInPage');
  res.render('dashboard', { currentAdmin: req.cookies.admin });
};

// View profile
const viewProfile = async (req, res) => {
  const admin = await adminDetails.findById(req.cookies.admin._id);
  if (admin) return res.render('viewProfile', { currentAdmin: admin });
  res.redirect('/signInPage');
};

// Add admin page
const addAdminPage = (req, res) => res.render('addAdminPage');

// Admin table
const adminTable = async (req, res) => {
  const records = await adminDetails.find();
  res.render('adminTable', { records });
};

// Insert new admin
const adminInsert = async (req, res) => {
  const imagePath = req.file ? req.file.path : '';
  await adminDetails.create({ ...req.body, adminImage: imagePath });
  res.redirect('/addAdminPage');
};

// Delete admin
const deleteAdmin = async (req, res) => {
  const admin = await adminDetails.findById(req.params.deleteId);
  if (admin?.adminImage && fs.existsSync(admin.adminImage)) fs.unlinkSync(admin.adminImage);
  await adminDetails.findByIdAndDelete(req.params.deleteId);
  res.redirect('/adminTable');
};

// Edit admin
const editAdminPage = async (req, res) => {
  const admin = await adminDetails.findById(req.params.id);
  if (admin) return res.render('editAdminPage', { record: admin });
  res.send("Admin not found.");
};

// Update admin
const updateAdmin = async (req, res) => {
  const admin = await adminDetails.findById(req.params.id);
  if (!admin) return res.send("Admin not found.");

  if (req.file && admin.adminImage && fs.existsSync(admin.adminImage)) {
    fs.unlinkSync(admin.adminImage);
  }

  const updateData = { ...req.body, adminImage: req.file ? req.file.path : admin.adminImage };
  await adminDetails.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/viewProfile');
};

// Logout
const logout = (req, res) => {
  res.clearCookie('admin');
  res.redirect('/');
};

module.exports = {
  signInPage,
  adminChecked,
  lostpasswordpage,
  otpVerifyPage,
  setNewPasswordPage,
  lostpasswordforcheckemail,
  verifyOTP,
  checkNewPassword,
  changePasswordPage,
  changePassword,
  dashboard,
  addAdminPage,
  adminTable,
  adminInsert,
  deleteAdmin,
  editAdminPage,
  updateAdmin,
  viewProfile,
  logout
};
