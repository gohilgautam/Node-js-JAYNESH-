const Admin = require('../models/adminModel');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Dashboard Page
const DashbordPage = async (req, res) => {
    res.render('dashbord', { success: req.flash('success'), error: req.flash('error') });

};

// Add Admin Page
const addAdminPage = (req, res) => {
    res.render('addAdmin', { success: req.flash('success'), error: req.flash('error') });

};

// Insert New Admin
const insertAdmin = async (req, res) => {
    try {
        req.body.avatar = req.file.path;
        const insert = await Admin.create(req.body);
        if (insert) {
            req.flash('success', 'Admin added successfully!');
        } else {
            req.flash('error', 'Admin could not be added.');
        }
        res.redirect('/addAdmin');
    } catch (error) {
        req.flash('error', 'Something went wrong.');
        res.send(`<h2> not found : ${error} </h2>`);
    }
};

// View All Admins (excluding current)
const viewAdminPage = async (req, res) => {
    try {
        const currentAdmin = req.user;
        let records = await Admin.find();
        records = records.filter((data) => data.id != currentAdmin._id)
        res.render('viewAdmins', {

            records,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (e) {
        res.send(`<p> Not Found : ${e} </p>`);
    }
};

// Edit Admin Page
const UpdateAdmin = async (req, res) => {
    try {
        const data = await Admin.findById(req.query.id);
        if (data) {
            res.render('updateAdmin', {
                data,
                success: "",
                error: ""
            });
        } else {
            console.log("Single Record not found...");
        }
    } catch (e) {
        res.send(`<p> Not Found : ${e} </p>`);
    }
};

// Edit Admin Logic
const editAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.editId);
        if (!admin) return res.send("Admin not found");

        if (req.file) {
            // Delete old image
            if (fs.existsSync(admin.avatar)) {
                fs.unlinkSync(admin.avatar);
            }

            // Set new path (relative)
            req.body.avatar = "uploads/" + req.file.filename;
        } else {
            req.body.avatar = admin.avatar;
        }

        await Admin.findByIdAndUpdate(req.params.editId, req.body);
        req.flash('success', 'Admin updated successfully');
        res.redirect('/viewadmin');
    } catch (e) {
        console.error("Edit error:", e);
        res.send(`<p>Error: ${e.message}</p>`);
    }
};



// Delete Admin

// DeleteAdmin controller
const DeleteAdmin = async (req, res) => {
    try {
        const data = await Admin.findById(req.params.id);
        if (!data) {
            console.log("Admin not found");
            return res.status(404).send("Admin not found");
        }

        const imagePath = path.join(__dirname, '..', data.avatar);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Admin.findByIdAndDelete(req.params.id);
        req.flash('success', 'Admin deleted successfully');
        res.redirect('/viewadmin');
    } catch (e) {
        console.error("Delete error:", e);
        res.status(500).send(`<p> Error: ${e.message} </p>`);
    }
};


// Login Page
const loginPage = (req, res) => {
    const error = req.session.message;
    res.render('login', { success: req.flash('success'), error: error });
    req.session.message = undefined;
};

// Login Logic
const userChecked = async (req, res) => {
    console.log("-------Running------------");
    req.flash('success', 'Admin login successfully');
    res.redirect("/dashboard");
};

// Logout
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect("/");
    });
};

// Profile Page
const viewProfile = async (req, res) => {
    const currentAdmin = req.user;
    res.render("profile", { currentAdmin, success: req.flash('success'), error: req.flash('error') });
};


//profile update 
const updateProfile = async (req, res) => {
    try {
        const updateId = req.user._id;
        const data = await Admin.findById(updateId);
        const currentAdmin = req.user;

        if (data) {
            res.render('updateprofile', { data, currentAdmin, success: "", error: "" });
        } else {
            res.send("Admin record not found.");
        }
    } catch (e) {
        res.send(`<p> Not Found : ${e} </p>`);
    }
};

//edit profile
const editProfile = async (req, res) => {
    try {
        const editId = req.user._id;
        const data = await Admin.findById(editId);
        if (!data) return res.send("Admin not found");

        // If new image is uploaded, delete old one and update path
        if (req.file) {
            const oldPath = "public" + data.avatar; // correct for relative path
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            req.body.avatar = "/uploads/" + req.file.filename;
        } else {
            req.body.avatar = data.avatar; // keep old image
        }

        await Admin.findByIdAndUpdate(editId, req.body);
        req.flash('success', 'Profile updated successfully');
        res.redirect('/viewProfile');

    } catch (e) {
        console.error("Edit error:", e);
        res.send(`<p>Error: ${e.message}</p>`);
    }
};




// Password Change Page
const changePassword = async (req, res) => {
    res.render('Changepassword', { success: req.flash('success'), error: req.flash('error') });
};

// Handle Password Change
const changemypassword = async (req, res) => {
    const { oldpassword, newpassword, confimpassword } = req.body;

    try {
        if (!req.user) {
            req.flash('error', 'User not logged in');
            return res.redirect('/changepassword');
        }

        const myAdmin = await Admin.findById(req.user.id);

        if (myAdmin.password !== oldpassword) {
            req.flash('error', 'Current password is incorrect');
            return res.redirect('/changepassword');
        }

        if (newpassword === oldpassword) {
            req.flash('error', 'New password must be different from current password');
            return res.redirect('/changepassword');
        }

        if (newpassword !== confimpassword) {
            req.flash('error', 'New and confirm passwords do not match');
            return res.redirect('/changepassword');
        }

        await Admin.findByIdAndUpdate(req.user.id, { password: newpassword });
        req.flash('success', 'Password updated successfully. Please log in again.');
        return req.logout(() => res.redirect('/'));
    } catch (e) {
        console.error("Password update error:", e);
        req.flash('error', 'Something went wrong.');
        return res.redirect('/changepassword');
    }
};


// Forgot Password Page
const losspassword = async (req, res) => {
    res.render('losspassword');
};

// Send OTP
const checkEmail = async (req, res) => {
    const email = req.body.email;
    const data = await Admin.findOne({ email });

    if (data) {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            service: "gmail",
            secure: false,
            auth: {
                user: "rahulpatadiya07@gmail.com",
                pass: "elyiecppuhrbpfnk",
            },
        });

        const OTP = Math.floor(Math.random() * 999999);

        const info = await transporter.sendMail({
            from: 'rahulpatadiya07@gmail.com',
            to: email,
            subject: "One-Time Password (OTP) for Forget Password",
            html: `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f3f3f3;
          padding: 0;
          margin: 0;
        }
        .container {
          max-width: 600px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .sub-header {
          text-align: center;
          font-size: 16px;
          color: #555;
          margin-bottom: 20px;
        }
        .greeting {
          font-size: 16px;
          color: #333;
          margin-bottom: 20px;
        }
        .otp-box {
          text-align: center;
          font-size: 36px;
          color: #4CAF50;
          font-weight: bold;
          margin: 30px 0;
          border: 2px dashed #4CAF50;
          padding: 20px;
          border-radius: 10px;
          background-color: #f9f9f9;
        }
        .note {
          font-size: 14px;
          color: #777;
          margin-bottom: 20px;
          text-align: center;
        }
        .support {
          font-size: 14px;
          color: #555;
          margin-top: 30px;
          text-align: center;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #aaa;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">OTP Verification</div>
        <div class="sub-header">Secure your account with the One-Time Password (OTP)</div>

        <div class="greeting">
          Hello <strong>${email}</strong>,<br><br>
          We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed with the verification:
        </div>

        <div class="otp-box">${OTP}</div>

        <div class="note">
          ⚠️ This OTP is valid for <strong>5 minutes</strong> only. Do not share it with anyone for security reasons.
        </div>

        <div class="support">
          If you did not request a password reset, please ignore this email or contact our support team immediately.<br>
          Need help? Reach out at <a href="mailto:support@example.com">support@example.com</a>
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </div>
    </body>
  </html>,
`

        });

        if (info.messageId) {
            res.cookie('OTP', OTP);
            res.cookie('email', email);
            res.redirect('/otpVerify');
        } else {
            res.redirect('/lostpassword');
        }
    } else {
        res.redirect('/lostpassword');
    }
};

// Verify OTP Page
const otpVerify = (req, res) => {
    res.render('otpVerify');
};

// Check OTP
const checkOtp = (req, res) => {
    const enteredOtp = req.body.otp;
    const storedOtp = req.cookies.OTP;

    if (enteredOtp === storedOtp) {
        res.redirect('/newsetpassword');
    } else {
        res.redirect('/otpVerify');
    }
};


// New Password Set Page
const newsetpassword = (req, res) => {
    res.render('newsetpassword');
};

// Update New Password
const checknewpassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) return res.redirect('/newsetpassword');

        const email = req.cookies.email;
        const user = await Admin.findOne({ email });
        if (!user) return res.redirect('/newsetpassword');

        const updated = await Admin.findByIdAndUpdate(user.id, { password: newPassword });
        if (updated) {
            res.clearCookie('email');
            res.clearCookie('OTP');
            res.redirect('/');
        } else {
            res.redirect('/newsetpassword');
        }
    } catch (e) {
        res.send(`Not Found : ${e}`);
    }
};

module.exports = {
    DashbordPage,
    addAdminPage,
    insertAdmin,
    viewAdminPage,
    UpdateAdmin,
    editAdmin,
    DeleteAdmin,
    loginPage,
    userChecked,
    logout,
    viewProfile,
    editProfile,
    updateProfile,
    changePassword,
    changemypassword,
    losspassword,
    otpVerify,
    checkEmail,
    checkOtp,
    newsetpassword,
    checknewpassword
};