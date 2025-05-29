// Admin Checked (login)
const adminDetails = require('../models/adminModel');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Sign In Page
const signInPage = (req, res) => {
  res.render("signInPage");
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
    res.redirect('/signInPage');
  }
};

// Lost Password Page
const lostpasswordpage = (req, res) => {
  res.render('auth/lostpasswordpage');
};


// Send OTP to Email
const lostpasswordforcheckemail = async (req, res) => {
  try {
    const email = req.body.resetEmail;
    const data = await adminDetails.findOne({ adminEmail: email });

    if (data) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "gohilgautam2405@gmail.com",
          pass: "voffscmxvpkvrwla",
        },
      });

      const OTP = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

      const info = await transporter.sendMail({
        from: '"Admin Panel" <gohilgautam2405@gmail.com>',
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
                            src="https:i.imghippo.com/files/xZkvY1724649505.png"
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
        res.cookie("otp", OTP);             // No maxAge
        res.cookie("resetEmail", email);    // No maxAge
        res.redirect('/otpVerifyPage');
      } else {
        res.redirect('/lostpasswordpage');
      }
    } else {
      res.redirect('/lostpasswordpage');
    }
  } catch (e) {
    console.log(e);
    res.redirect('/lostpasswordpage');
  }
};

// OTP Verification Page
const otpVerifyPage = (req, res) => {
  res.render('auth/otpVerifyPage');
};

// Verify OTP from Cookie
const verifyOTP = (req, res) => {
  const userOTP = req.body.OTP;
  const storedOTP = req.cookies.otp;

  if (userOTP == storedOTP) {
    res.redirect('/auth/setNewPasswordPage');
  } else {
    res.redirect('back');
  }
};

// Set New Password Page
const setNewPasswordPage = (req, res) => {
  res.render("auth/setNewPasswordPage", { success: "", error: "" });
};

// Update Password after Forgot
const checkNewPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const email = req.cookies.resetEmail;

  if (newPassword !== confirmPassword) {
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
      res.redirect('/signInPage');
    } else {
      res.redirect('/auth/setNewPasswordPage');
    }
  } catch (e) {
    res.send(`Error: ${e}`);
  }
};



// Change Password (Logged-in Admin)
const changePasswordPage = (req, res) => {
  res.render("auth/changePasswordPage", { success: "Password Has Been Changed", error: "Please check your password" });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const adminId = req.session.admin?._id;
  const adminData = await adminDetails.findById(adminId);

  if (adminData.adminPassword === oldPassword) {
    if (newPassword !== oldPassword && newPassword === confirmPassword) {
      try {
        await adminDetails.findByIdAndUpdate(adminId, { adminPassword: newPassword });
        req.session.destroy(err => {
          if (err) return res.send("Error logging out.");
          res.redirect('/');
        });
      } catch (e) {
        res.send(`Update error: ${e}`);
      }
    } else {
      res.redirect("/changePasswordPage");
    }
  } else {
    res.redirect("/changePasswordPage");
  }
};

// Dashboard
const dashboard = (req, res) => {
  const admin = req.session.admin;
  res.render("dashboard", {
    success: req.session.success || "",
    error: req.session.error || "",
    admin
  });
  req.session.success = "";
  req.session.error = "";
};

// Add Admin Page
const addAdminPage = (req, res) => {
  res.render("addAdminPage", {
    success: req.session.success || "",
    error: req.session.error || ""
  });
  req.session.success = "";
  req.session.error = "";
};

// Admin List
const adminTable = async (req, res) => {
  try {
    let records = await adminDetails.find({});
    records = records.filter(admin => admin.id != req.session.admin?._id);
    res.render("adminTable", {
      records,
      success: req.session.success || "",
      error: req.session.error || ""
    });
    req.session.success = "";
    req.session.error = "";
  } catch (e) {
    res.send(`Error: ${e}`);
  }
};

// Insert Admin
const adminInsert = async (req, res) => {
  try {
    req.body.adminImage = req.file.path;
    const insert = await adminDetails.create(req.body);

    req.session.success = insert ? "New Admin Inserted..." : "Insertion Failed...";
    res.redirect("/addAdminPage");
  } catch (e) {
    res.send(`Error: ${e}`);
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
    res.send(`Error: ${e}`);
  }
};

// Edit Admin Page (Load Existing)
const editAdminPage = async (req, res) => {
  const editId = req.params.id;
  const records = await adminDetails.findById(editId);
  res.render("editAdminPage", { records });  // pass as records
};


// Edit Admin
const editAdmin = async (req, res) =>{
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
    const update = await adminDetails.findByIdAndUpdate(editId, req.body, {
      new: true,
    });
    req.session.success = "Admin Updated Successfully";
    res.redirect("/adminTable");
  } else {
    res.send("Admin not found.");
  }
} catch (e) {
  res.send(`Error: ${e}`);
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

    const updated = await adminDetails.findByIdAndUpdate(req.params.id, updateData);
    req.session.admin = updated;
    res.redirect('/adminTable');
  } catch (e) {
    res.send(`Update Failed: ${e}`);
  }
};

// View Profile
const viewProfile = async (req, res) => {
  res.render("viewProfile", {
    currentAdmin: req.session.admin,
    success: "",
    error: ""
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
