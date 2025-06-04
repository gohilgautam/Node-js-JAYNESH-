// Admin Checked (login)
const adminDetails = require('../models/adminModel');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Sign In Page
const signInPage = (req, res) => {
  res.render("signInPage", {
    success: req.flash("success", "Admin Login Successfully..."),
    error: req.flash('error')
  });
};

// Admin Checked (Login)
const adminChecked = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;
  const adminData = await adminDetails.findOne({ adminEmail });

  if (adminData && adminData.adminPassword === adminPassword) {
    req.session.admin = adminData;
    req.flash("success", "Admin Login Successfully...");
    res.redirect('/dashboard');
  } else {
    req.flash("error", "Invalid Email or Password");
    res.redirect('/signInPage');
  }
};

// Lost Password Page
const lostpasswordpage = (req, res) => {
  res.render('auth/lostpasswordpage', {
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Send OTP to Email
const lostpasswordforcheckemail = async (req, res) => {
  try {
    const email = req.body.resetEmail;
    const data = await adminDetails.findOne({ adminEmail: email });
    console.log("Check mail", email);
    console.log("Check data", data);

    if (data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "gohilgautam2405@gmail.com",
          pass: "voffscmxvpkvrwla",
        },
        tls: {
          rejectUnauthorized: false
        }
      });

const OTP_NUMBER = Math.floor(Math.random() * 1000000);
const OTP = OTP_NUMBER.toString().padStart(6, '0');

const otpDigits = OTP.split('');

let otpBoxesHtml = '';
otpDigits.forEach(digit => {
  otpBoxesHtml += `<div>${digit}</div>`;
});

const info = await transporter.sendMail({
  from: '"Admin Panel" <gohilgautam2405@gmail.com>',
  to: email,
  subject: "OTP for Password Reset",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 20px;
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      max-width: 500px;
      width: 100%;
    }

    .header {
      background-color: #2b6cb0;
      color: white;
      text-align: center;
      padding: 30px 20px;
    }

    .logo {
      width: 40px;
      height: 40px;
      margin-bottom: 10px;
    }

    .header h2 {
      margin: 0;
      font-size: 16px;
      letter-spacing: 1px;
    }

    .header h3 {
      margin: 5px 0 0;
      font-size: 20px;
    }

    .content {
      padding: 25px 20px;
      color: #333;
      font-size: 14px;
    }

    .otp-boxes {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }

    .otp-boxes div {
      width: 45px;
      height: 45px;
      border: 2px solid #2b6cb0;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
      color: #2b6cb0;
    }

    .note {
      font-size: 13px;
      color: #555;
      margin-bottom: 20px;
    }

    .verify-button {
      background-color: #f97316;
      color: white;
      border: none;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
    }

    .verify-button:hover {
      background-color: #ea580c;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="../images/logo.png" class="logo"/>
        <h2>THANKS FOR SIGNING UP!</h2>
        <h3>Verify Your E-Mail Address</h3>
      </div>

      <div class="content">
        <p>Hello John Deo,</p>
        <p>Please use the following One Time Password (OTP)</p>

        <div class="otp-boxes" id="otp-boxes">
          ${otpBoxesHtml}
        </div>

        <p class="note">
          This passcode will only be valid for the next <strong>2 minutes</strong>. If the passcode does not work, you can use this login verification link:
        </p>

        <button class="verify-button">Verify Email</button>
      </div>
    </div>
  </div>
</body>
</html>`,
});

      if (info.messageId) {
        res.cookie("otp", OTP);             // No maxAge
        res.cookie("resetEmail", email);    // No maxAge
        req.flash("success", "OTP sent to your email.");
        res.redirect('/otpVerifyPage');
      } else {
        req.flash("error", "Failed to send OTP. Try again.");
        res.redirect('/lostpasswordpage');
      }
    } else {
      req.flash("error", "Email not registered.");
      res.redirect('/lostpasswordpage');
    }
  } catch (e) {
    console.log(e);
    req.flash("error", "Something went wrong.");
    res.redirect('/lostpasswordpage');
  }
};

// OTP Verification Page
const otpVerifyPage = (req, res) => {
  res.render('auth/otpVerifyPage', {
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Verify OTP from Cookie
const verifyOTP = (req, res) => {
  const userOTP = req.body.OTP;
  const storedOTP = req.cookies.otp;

  if (userOTP == storedOTP) {
    req.flash("success", "OTP verified successfully.");
    res.redirect('/auth/setNewPasswordPage');
  } else {
    req.flash("error", "Invalid OTP. Please try again.");
    res.redirect('back');
  }
};

// Set New Password Page
const setNewPasswordPage = (req, res) => {
  res.render("auth/setNewPasswordPage", {
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Update Password after Forgot
const checkNewPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.cookies.resetEmail;

  if (newPassword !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/auth/setNewPasswordPage');
  }

  try {
    const updated = await adminDetails.findOneAndUpdate(
      { adminEmail: email },
      { adminPassword: newPassword }
    );

    if (updated) {
      res.clearCookie("otp");
      res.clearCookie("resetEmail");
      req.flash('success', 'Password updated successfully. Please login.');
      res.redirect('/signInPage');
    } else {
      req.flash('error', 'Failed to update password.');
      res.redirect('/auth/setNewPasswordPage');
    }
  } catch (e) {
    req.flash('error', `Error: ${e.message}`);
    res.redirect('/auth/setNewPasswordPage');
  }
};

// Change Password (Logged-in Admin)
const changePasswordPage = (req, res) => {
  res.render("changePasswordPage", {
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Change Password
const changePassword = async (req, res) => {
  console.log(req.body);

  const { oldPassword, newPassword, confirmPassword } = req.body;
  // const email = req.session.admin.adminEmail;
  const Admin = req.user;
  console.log(Admin);
  if (oldPassword == Admin.password) {
    if (newPassword != Admin.password) {
      if (newPassword == confirmPassword) {
        try {
          const isUpdate = await adminDetails.findByIdAndUpdate(Admin._id, {
            password: newPassword,
          });
          if (isUpdate) {
            console.log("Password updated...", isUpdate);
            req.session.destroy(function (err) {
              if (err) {
                console.log(err);
                return false;
              }
              res.redirect("/");
            });
          } else {
            console.log("Password updation failed...");
          }
        } catch (e) {
          res.send(`<p> Not Found : ${e} </p>`);
        }
      } else {
        res.redirect("/changePasswordPage");
      }
    } else {
      res.redirect("/changePasswordPage");
    }
  } else {
    console.log("Password is incorrect............");

    res.redirect("/changePasswordPage");
  }
};

// Dashboard
const dashboard = (req, res) => {
  const admin = req.session.admin;
  res.render("dashboard", {
    success: req.flash('success'),
    error: req.flash('error'),
    admin
  });
};

// Add Admin Page
const addAdminPage = (req, res) => {
  res.render("addAdminPage", {
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Admin List
const adminTable = async (req, res) => {
  try {
    let records = await adminDetails.find({});
    records = records.filter(admin => admin.id != req.session.admin?._id);
    res.render("adminTable", {
      records,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (e) {
    req.flash('error', `Error: ${e.message}`);
    res.redirect('/dashboard');
  }
};

// Insert Admin
const adminInsert = async (req, res) => {
  try {
    req.body.adminImage = req.file?.path;
    const insert = await adminDetails.create(req.body);

    if (insert) {
      req.flash('success', "New Admin Inserted...");
    } else {
      req.flash('error', "Insertion Failed...");
    }
    res.redirect("/addAdminPage");
  } catch (e) {
    req.flash('error', `Error: ${e.message}`);
    res.redirect("/addAdminPage");
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const data = await adminDetails.findById(req.params.deleteId);
    if (data) {
      if (data.adminImage && fs.existsSync(data.adminImage)) {
        fs.unlinkSync(data.adminImage);
      }
      await adminDetails.findByIdAndDelete(req.params.deleteId);
      req.flash('success', 'Admin deleted successfully.');
      res.redirect('/adminTable');
    } else {
      req.flash('error', 'Admin not found.');
      res.redirect('/adminTable');
    }
  } catch (e) {
    req.flash('error', `Error: ${e.message}`);
    res.redirect('/adminTable');
  }
};

// Edit Admin Page (Load Existing)
const editAdminPage = async (req, res) => {
  const editId = req.params.id;
  const records = await adminDetails.findById(editId);
  res.render("editAdminPage", {
    records,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Edit Admin
const editAdmin = async (req, res) => {
  try {
    const editId = req.params.id;
    const data = await adminDetails.findById(editId);
    if (data) {
      if (req.file) {
        if (data.adminImage && fs.existsSync(data.adminImage)) {
          fs.unlinkSync(data.adminImage);
        }
        req.body.adminImage = req.file.path;
      }
      await adminDetails.findByIdAndUpdate(editId, req.body, { new: true });
      req.flash('success', "Admin Updated Successfully");
      res.redirect("/adminTable");
    } else {
      req.flash('error', "Admin not found.");
      res.redirect("/adminTable");
    }
  } catch (e) {
    req.flash('error', `Error: ${e.message}`);
    res.redirect("/adminTable");
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const existing = await adminDetails.findById(req.params.id);
    if (!existing) {
      req.flash('error', "Admin not found.");
      return res.redirect('/adminTable');
    }

    let updateData = req.body;
    if (req.file) {
      if (existing.adminImage && fs.existsSync(existing.adminImage)) {
        fs.unlinkSync(existing.adminImage);
      }
      updateData.adminImage = req.file.path;
    } else {
      updateData.adminImage = existing.adminImage;
    }

    const updated = await adminDetails.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success', 'Admin updated successfully.');
    if (existing.adminEmail == req.user.adminEmail) {
      const user = await adminDetails.findById(req.params.id);
      req.session.admin = user;

      res.redirect('/viewProfile');

    } else {
      res.redirect('/adminTable');
    }
  } catch (e) {
    req.flash('error', `Update Failed: ${e.message}`);
    res.redirect('/adminTable');
  }
};

// View Profile
const viewProfile = async (req, res) => {
  res.render("viewProfile", {
    currentAdmin: req.session.admin,
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Logout
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return false;
    }
    res.redirect("/");
  });
};

module.exports = {
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
  adminInsert,
  deleteAdmin,
  editAdminPage,
  editAdmin,
  updateAdmin,
  viewProfile,
  logout,
};
