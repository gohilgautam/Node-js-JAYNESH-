const admin = require("../models/AdminModel");
const fs = require("fs");
const nodemailer = require("nodemailer");

// Login

const loginPage = (req, res) => {
  res.render("auth/login");
};

const userChecked = async (req, res) => {
  try {
    req.flash("success", "Admin Login Successfully...");
    res.redirect("/dashboard");
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};

// Lost Password

const lostPassword = (req, res) => {
  res.render("auth/lostPassword");
};

const checkEmail = async (req, res) => {
  console.log(req.body);

  const email = req.body.email;

  const data = await admin.findOne({ email: email });

  console.log(data);

  if (data) {
    // Send OTP Mail

    // Init Mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gohilgautam2406@gmail.com",
        pass: "haplndideulmtcne",
      },
    });

    // Send Mail

    const OTP = Math.floor(Math.random() * 999999);

    const info = await transporter.sendMail({
      from: 'gohilgautam2406@gmail.com', // sender address
      to: email, // list of receivers
      subject: "One-Time Password (OTP) for Forget Password", // Subject line
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

    console.log("Message sent: %s", info.messageId);

    if (info.messageId) {
      // OTP Page
      res.cookie("OTP", OTP);
      res.cookie("email", email);
      res.redirect("/otpVerifyPage");
    } else {
      res.redirect("/lostPasswordPage");
    }
  } else {
    res.redirect("/lostPasswordPage");
  }
};

const otpVerifyPage = (req, res) => {
  res.render("auth/otpVerify");
};

const checkOTP = (req, res) => {
  console.log(req.body);
  console.log(req.cookies.OTP);

  if (req.body.OTP == req.cookies.OTP) {
    res.clearCookie("OTP");
    res.redirect("/newSetPasswordPage");
  } else {
    res.redirect("back");
    console.log("OTP has not matched...");
  }
};

const newSetPasswordPage = (req, res) => {
  res.render("auth/newSetPassword");
};

const checkNewPassword = async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.newPassword == req.body.conformPassword) {
      const email = req.cookies.email;

      const data = await admin.findOne({ email: email });

      if (data) {
        const updatePass = await admin.findByIdAndUpdate(data.id, {
          password: req.body.newPassword,
        });
        if (updatePass) {
          console.log("Password Updated...");

          res.clearCookie("email");

          res.redirect("/");
        } else {
          console.log("Password not updated....");

          res.redirect("back");
        }
      } else {
        console.log("Email is not valid...");

        res.redirect("back");
      }
    } else {
      console.log("New Password and Conform Password has not matched....");

      res.redirect("back");
    }
  } catch (e) {
    res.send(`Not Found : ${e}`);
  }
};

// Logout
const logout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      return false;
    }
    res.redirect("/");
  });
};

// Change Password

const changePassword = (req, res) => {
  res.render("admin/changePassword", { success: "", error: "" });
};

const changeMyNewPassword = async (req, res) => {
  console.log(req.body);

  const { currentPassword, newPassword, conformPassword } = req.body;

  const myAdmin = req.user;

  console.log(myAdmin);

  if (currentPassword == myAdmin.password) {
   
    if (newPassword != myAdmin.password) {
      if (newPassword == conformPassword) {
        try {
          const isUpdate = await admin.findByIdAndUpdate(myAdmin._id, {
            password: newPassword,
          });
          if (isUpdate) {
            console.log("Password updated...", isUpdate);
            req.flash('success', 'Your password has been updated successfully!');
            req.session.destroy(function (err) {
              if (err) {
                console.log(err);
                req.flash('error', 'There was an issue logging you out after password change.');
                return res.redirect("/changePassword");
              }
              res.redirect("/");
            });
          } else {
            console.log("Password updation failed...");
           
            req.flash('error', 'Failed to update your password. Please try again.');
            res.redirect("/changePassword");
          }
        } catch (e) {
          console.error("Error updating password:", e);
          req.flash('error', `An unexpected error occurred: ${e.message || 'Please try again.'}`);
          res.redirect("/changePassword");
        }
      } else {
        req.flash('error', 'New password and confirm password do not match.');
        res.redirect("/changePassword");
      }
    } else {
      req.flash('error', 'Your new password cannot be the same as your current password.');
      res.redirect("/changePassword");
    }
  } else {
    console.log("Password is incorrect............");
    req.flash('error', 'The current password you entered is incorrect.');
    res.redirect("/changePassword");
  }
};

// View Profile

const viewProfile = (req, res) => {
  const currentAdmin = req.user;
  res.render("admin/profile", { currentAdmin, success: "", error: "" });
};

// DashBoard

const dashboardPage = (req, res) => {
  res.render("dashboard", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

const addAdminPage = (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("admin/addAdmin", { success: success, error: error });
};

const viewAdminPage = async (req, res) => {
  try {
    let records = await admin.find({});

    // records = records.filter((data) => data.id != currentAdmin._id);

    // console.log("User Data", records);

    records = records.filter((data) => data.id != req.user.id);

    console.log(records);

    const success = req.flash("success");
    const error = req.flash("error");

    res.render("admin/viewAdmin", { records, success, error });
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};

// CRUD

const insertAdminData = async (req, res) => {
  console.log(req.body);

  console.log(req.file);

  try {
    req.body.avatar = req.file.path;

    const insert = await admin.create(req.body);

    if (insert) {
      req.flash("success", "New Admin Inserted...");
      console.log("Admin Data is Inserted...");
    } else {
      req.flash("error", "New Admin Insertion Failed...");
      console.log("Admin Data is not insertion...");
    }

    res.redirect("back");
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};

const deleteAdmin = async (req, res) => {
  const delId = req.params.delId;

  try {
    const data = await admin.findById(delId);

    if (data) {
      console.log(data.avatar);

      fs.unlinkSync(data.avatar);

      const deletedData = await admin.findByIdAndDelete(delId);

      if (deletedData) {
        req.flash("success", `${deletedData.fname} deleted successfully...`);
      } else {
        req.flash("error", `${deletedData.fname} deletion failed...`);
      }

      res.redirect("back");
    } else {
      console.log("Single Record not found....");
    }
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};

const updateAdmin = async (req, res) => {
  const updateId = req.query.id;

  try {
    const data = await admin.findById(updateId);

    if (data) {
      res.render("admin/updateAdmin", { data, success: "", error: "" });
    } else {
      console.log("Single Record not found...");
    }
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};

const editAdmin = async (req, res) => {
  const editId = req.params.editId;

  const data = await admin.findById(editId);

  try {
    if (req.file) {
      // unlink
      // update
    } else {
      req.body.avatar = data.avatar;

      try {
        await admin.findByIdAndUpdate();
      } catch (e) {
        res.send(`<p> Not Found : ${e} </p>`);
      }
    }
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};

module.exports = {
  loginPage,
  lostPassword,
  checkEmail,
  otpVerifyPage,
  checkOTP,
  userChecked,
  newSetPasswordPage,
  checkNewPassword,
  dashboardPage,
  addAdminPage,
  viewAdminPage,
  insertAdminData,
  deleteAdmin,
  updateAdmin,
  editAdmin,
  logout,
  changePassword,
  changeMyNewPassword,
  viewProfile,
};
