const adminDetails = require('../models/adminModel');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Sign In Page
const signInPage = (req, res) => {
    if (!req.cookies.admin) {
        res.render('signInPage');
    } else {
        res.redirect('/dashboard');
    }
};

// Admin Checked (login)
const adminChecked = async (req, res) => {
    const { adminEmail, adminPassword } = req.body;
    try {
        const adminData = await adminDetails.findOne({ adminEmail });
        if (adminData && adminData.adminPassword === adminPassword) {
            res.cookie('admin', { _id: adminData._id });
            res.redirect('/dashboard');
        } else {
            console.log("Invalid email or password.");
            res.redirect('/signInPage');
        }
    } catch (e) {
        res.send(`<p>Error: ${e}</p>`);
    }
};

// Lost Password Page
const lostpasswordpage = (req, res) => {
    res.render('auth/lostpasswordpage');  // updated to lowercase path
};

// Check Email for password reset (send OTP)
const lostpasswordforcheckemail = async (req, res) => {
    const email = req.body.resetEmail;
    const data = await adminDetails.findOne({ adminEmail: email });

    if (data) {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            service: "gmail",
            secure: false, 
            auth: {
                user: "gohilgautam2406@gmail.com",
                pass: "yhliwejqeabrdmqf",
            },
        });

        const OTP = Math.floor(Math.random() * 999999);

        const info = await transporter.sendMail({
            from: '"Admin Panel" <gohilgautam2406@gmail.com>',
            to: email,
            subject: "OTP for Password Reset",
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
</html>`,
        });

        if (info.messageId) {
            res.cookie('OTP', OTP);
            res.cookie('resetEmail', email);
            res.redirect('/otpVerifyPage');
        } else {
            res.redirect('/lostpasswordpage');
        }
    } else {
        res.redirect('/lostpasswordpage');
    }
};


// OTP Verify Page
const otpVerifyPage = (req, res) => {
    res.render('auth/otpVerifyPage');
};


// Verify OTP
const verifyOTP = (req, res) => {
    console.log(req.body);
    console.log(req.cookies.OTP);
    console.log(req.cookies.resetEmail);
    // Verify OTP here
    if (req.body.OTP == req.cookies.OTP) {
        res.render('/setNwePasswordPage');
    } else {
        console.log("Invalid OTP.");
        res.redirect('back');
    }
};

// New Set Password Page
const setNewPasswordPage = (req, res) => {
    res.render('auth/setNewPasswordPage');
};

// Change Password Page
const changePasswordPage = (req, res) => {
    if (!req.cookies.admin) {
        return res.redirect('/signInPage');
    }
    res.render('auth/changePasswordPage'); 
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.cookies.admin?._id;

    try {
        const admin = await adminDetails.findById(adminId);

        if (!admin) {
            return res.send("Admin not found.");
        }

        if (admin.adminPassword !== oldPassword) {
            return res.send("Old password is incorrect.");
        }

        if (newPassword !== confirmPassword) {
            return res.send("New passwords do not match.");
        }

        admin.adminPassword = newPassword;
        await admin.save();

        res.redirect('/dashboard');
    } catch (e) {
        res.send(`Error changing password: ${e}`);
    }
};


// Check and save new password
const checkNewPassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const email = req.cookies.resetEmail;

    if (newPassword !== confirmPassword) {
        console.log("Passwords do not match.");
        res.redirect('/signInPage');
    }

    try {
        const updated = await adminDetails.findOneAndUpdate(
            { adminEmail: email },
            { adminPassword: newPassword }
        );

        if (updated) {
            res.clearCookie('resetEmail');
            res.clearCookie('OTP');
            res.redirect('/signInPage');
        } else {
            res.redirect('/auth/setNewPasswordPage'); 
        }
    } catch (e) {
        res.send(`Error: ${e}`);
    }
};

// Dashboard
const dashboard = (req, res) => {
    if (!req.cookies.admin) {
        return res.redirect('/signInPage');
    }
    res.render('dashboard', { currentAdmin: req.cookies.admin });
};

// Add Admin Page
const addAdminPage = (req, res) => {
    if (!req.cookies.admin) {
        return res.redirect('/signInPage');
    }
    res.render('addAdminPage');
};

// Admin Table (list all admins except current)
const adminTable = async (req, res) => {
    if (!req.cookies.admin) return res.redirect('/signInPage');

    try {
        let records = await adminDetails.find({});
        const currentAdmin = req.cookies.admin;

        records = records.filter(data => data._id.toString() !== currentAdmin._id);
        res.render('adminTable', { records, currentAdmin });
    } catch (e) {
        res.send(`<p>Error: ${e}</p>`);
    }
};

// Insert Admin (create)
const adminInsert = async (req, res) => {
    try {
        await adminDetails.create({
            ...req.body,
            adminImage: req.file ? req.file.path : ''
        });
        res.redirect('/addAdminPage');
    } catch (e) {
        res.send(`<p>Error: ${e}</p>`);
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
            res.redirect('/adminTable');
        } else {
            res.send("Admin not found.");
        }
    } catch (e) {
        res.send(`<p>Error: ${e}</p>`);
    }
};

// Edit Admin Page
const editAdminPage = async (req, res) => {
    try {
        const record = await adminDetails.findById(req.params.id);
        if (record) {
            res.render('editAdminPage', { record });
        } else {
            res.send("Admin not found.");
        }
    } catch (e) {
        res.send(`<p>Error: ${e}</p>`);
    }
};

// Update Admin
const updateAdmin = async (req, res) => {
    try {
        const existing = await adminDetails.findById(req.params.id);
        if (!existing) return res.send("Admin not found.");

        let updateData = req.body;

        if (req.file) {
            if (existing.adminImage && fs.existsSync(existing.adminImage)) {
                fs.unlinkSync(existing.adminImage);
            }
            updateData.adminImage = req.file.path;
        } else {
            updateData.adminImage = existing.adminImage;
        }

        const updated = await adminDetails.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.cookie('admin', { _id: updated._id });
        res.redirect('/viewProfile');
    } catch (e) {
        res.send(`<p>Update Failed: ${e}</p>`);
    }
};

// View Profile
const viewProfile = async (req, res) => {
    const cookieAdmin = req.cookies.admin;
    if (cookieAdmin) {
        const newAdmin = await adminDetails.findById(cookieAdmin._id);
        if (newAdmin) {
            res.render('viewProfile', { currentAdmin: newAdmin });
        } else {
            res.redirect('/signInPage');
        }
    } else {
        res.redirect('/signInPage');
    }
};

// Logout
const logout = (req, res) => {
    res.clearCookie('admin');
    res.redirect('/')
}

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
    updateAdmin,
    viewProfile,
    logout,
};
