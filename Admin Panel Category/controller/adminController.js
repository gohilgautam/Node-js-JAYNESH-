const admin = require('../model/AdminModel');
const nodemailer = require('nodemailer');
const fs = require('fs');

// login page
const loginPage = (req, res) => {
    const error = req.session.message;
    console.log("LOGIN : ", error);

    res.render('auth/login', { success: req.flash('success'), error: error });

    req.session.message = undefined;
};

// user checked
const userChecked = async (req, res) => {
  try {
    req.flash("success", "Admin Login Successfully...");
    res.redirect("/dashboard");
  } catch (e) {
    res.send(`<p> Not Found : ${e} </p>`);
  }
};


// logout
const logout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            return false
        }
        res.redirect('/')
    })
}


// lost password
const lostPasswordPage = (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');
    res.render('auth/lostPasswordPage', { success, error });
};

//veryfiy otp
const otpVerifyPage = (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');
    res.render('auth/otpVerifyPage', { success, error });
};

//check email
const checkEmail = async (req, res) => {
    const email = req.body.email;
    try {
        const data = await admin.findOne({ email });
        const otp = Math.floor(100000 + Math.random() * 900000);
        if (data) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "gohilgautam2405gmail.com",
                    pass: "gujjjyghriupzodb",
                },
            });

            const mailOptions = {
                from: '"Admin Panel" gohilgautam2405gmail.com',
                to: email,
                subject: "OTP for Password Reset",
                html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                  <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); padding: 30px; overflow: hidden;">
                    <div style="text-align: center;">
                      <h2 style="color: #333333; font-size: 26px; margin-bottom: 15px;">Password Recovery OTP</h2>
                      <p style="color: #555555; font-size: 16px;">Dear user,</p>
                      <p style="color: #555555; font-size: 16px;">
                        We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:
                      </p>
                    </div>
                    
                    <div style="background-color: #e0f7fa; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
                      <span style="font-size: 32px; font-weight: bold; color: #00796b;">${otp}</span>
                    </div>
              
                    <p style="color: #555555; font-size: 16px; text-align: center;">This OTP is valid for 10 minutes. Please don't share it with anyone.</p>
                    
                    <div style="text-align: center;">
                      <p style="color: #555555; font-size: 16px;">
                        If you did not request a password reset, please disregard this email.
                      </p>
                    </div>
              
                    <div style="text-align: center; font-size: 14px; margin-top: 30px; color: #777777;">
                      — Nency Vadadoriya
                    </div>
                  </div>
                </div>
              `

            };

            await transporter.sendMail(mailOptions);

            res.cookie("otp", otp);
            res.cookie("email", email);
            req.flash("success", "OTP sent successfully to your email.");
            res.redirect("/otpVerifyPage");
        } else {
            req.flash("error", "Email ID is not found.");
            res.redirect("/lostPasswordPage");
        }
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/lostPasswordPage");
    }
};

// cehck otp
const checkOtp = (req, res) => {
    const userOtp = req.body.otp;
    const storeOtp = req.cookies.otp;
    if (userOtp == storeOtp) {
        res.redirect("/newSetPassword");
    } else {
        req.flash("error", "Invalid OTP");
        res.redirect("/otpVerifyPage");
    }
};

// Show set new password page
const newsetpassword = (req, res) => {
    const success = req.flash('success');
    const error = req.flash('error');
    res.render('auth/newSetPassword', { success, error });
};

// Check  new password
const checknewpassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const email = req.cookies.email;

    if (!email) {
        req.flash('error', 'Session expire. Please try again.');
        return res.redirect('/newSetPassword');
    }
    if (newPassword !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/newSetPassword');
    }
    try {
        const user = await admin.findOne({ email });
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/newSetPassword');
        }

        await admin.findByIdAndUpdate(user._id, { password: newPassword });
        res.clearCookie('email');
        res.clearCookie('otp');
        req.flash('success', 'Password changed successfully. Please login.');
        return res.redirect('/');
    } catch (err) {
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/newSetPassword');
    }
};

// change password
const changePassword = (req, res) => {
    try {
        const currentAdmin = req.user;
        res.render('admin/changepassword', { currentAdmin, success: req.flash('success'), error: req.flash('error') });
    } catch (error) {
        res.send(`<h2> Not found : ${error} </h2>`);
    }
}

// change my password
const changemypassword = async (req, res) => {
    console.log(req.body);
    const { oldpassword, newpassword, confimpassword } = req.body;
    const password = req.user;
    if (oldpassword == password.password) {
        if (newpassword != password.password) {
            if (newpassword == confimpassword) {
                try {
                    const isUpdate = await admin.findByIdAndUpdate(password._id, { password: newpassword });
                    if (isUpdate) {
                        console.log("Password updated...", isUpdate);
                        req.flash('success', 'Password changed successfully!');
                        req.session.destroy(function (err) {
                            if (err) {
                                console.log(err);
                                return false;
                            }
                            res.redirect('/');
                        });

                    } else {
                        console.log("Password updation failed...");
                    }
                } catch (e) {
                    res.send(`<p> Not Found : ${e} </p>`);
                }
            } else {
                req.flash('error', 'New passwords do not match.');
                res.redirect('/changePassword');
            }
        } else {
            req.flash('error', 'New password cannot be the same as the old password.');
            res.redirect('/changePassword');
        }
    } else {
        console.log("Password is incorrect............");
        req.flash('error', 'Old password is incorrect.');
        res.redirect('/changePassword');
    }
};

// View Profile 
const viewProfile = (req, res) => {
    try {
        res.render('admin/viewProfile', { currentAdmin: req.user });
    } catch (error) {
        res.send(`<h2> Not found : ${error} </h2>`);
    }
}

// update profile
const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.send("<p>error : Admin not logged in</p>");
        }
        const currentAdmin = req.user;
        res.render('admin/updateprofile', { currentAdmin, success: req.flash('success'), error: req.flash('error'), });
    } catch (error) {
        res.send(`<h2> Not found : ${error} </h2>`);
    }
};

//edit profile logic
const editProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.send("<p>error : Admin not logged in</p>");
        }
        const currentAdmin = req.user;
        const id = currentAdmin._id;

        console.log("Id:", id);
        console.log("Profile Page Data:", req.body);
        const updatedAdmin = await admin.findByIdAndUpdate(id, req.body, { new: true });
        console.log("Updated Data:", updatedAdmin);

        if (updatedAdmin) {
            req.flash('success', 'Profile updated successfully!');
            res.cookie('admin', updatedAdmin);
            res.redirect('/homepage');
        } else {
            req.flash('error', 'Profile update failed. Please try again.');
            res.redirect('/updateprofile');
        }
    } catch (error) {
        res.send(`<h2> Not found: ${error} </h2>`);
    }
};

//===================views all pages ================================

// dashboard page
const dashboard = async (req, res) => {
    try {
        const currentAdmin = req.user;
        res.render('admin/dashboard', { currentAdmin, success: req.flash('success'), error: req.flash('error') });
    } catch (error) {
        res.send(`<h2>Error: ${error}</h2>`);
    }
};

// add admin page
const addAdminPage = (req, res) => {
    try {
        const currentAdmin = req.user;
        const success = req.flash('success');
        const error = req.flash('error');
        res.render('admin/addAdmin', { currentAdmin, success, error });
    } catch (error) {
        res.send(`<h2> Not found : ${error.message} </h2>`);
    }
};

// view admin logic
const viewAdminPage = async (req, res) => {
    try {
        const currentAdmin = req.user;

        let records = await admin.find({});
        records = records.filter((data) => data.id != currentAdmin._id);

        const success = req.flash('success');
        const error = req.flash('error');

        res.render('admin/viewAdminPage', { records, currentAdmin, success, error });
    } catch (error) {
        res.send(`<h2> Not found : ${error} </h2>`);
    }
};

//==============================   crud opretion logic  =================================

// insert admin
const insertAdminData = async (req, res) => {
    try {
        req.body.image = req.file.path;
        const insert = await admin.create(req.body);
        if (insert) {
            req.flash('success', 'Admin added successfully!');
            console.log('admin data inserted..')
        }
        else {
            req.flash('error', 'Admin could not be added.');
            console.log('admin data not inserted..')
        }
        res.redirect('/addAdmin');
    } catch (error) {
        req.flash('error', 'Something went wrong.');
        res.send(`<h2> not found : ${error} </h2>`);
    }
};

// delete admin
const DeleteAdmin = async (req, res) => {
    const DeleteId = req.params.DeleteId;
    try {
        const data = await admin.findByIdAndDelete(DeleteId);
        if (data && data.image) {
            fs.unlinkSync(data.image);
        }
        req.flash('success', 'Admin deleted successfully!');
        res.redirect('/viewAdmin');
    } catch (error) {
        req.flash('error', 'Something went wrong while deleting admin.');
        res.redirect('/viewAdmin');
    }
};

// update admin form
const UpdateAdmin = async (req, res) => {
    const UpdateId = req.query.id;
    try {
        const data = await admin.findById(UpdateId);
        if (data) {
            const currentAdmin = req.user;
            res.render('admin/updateadmin', { data, currentAdmin });
        } else {
            res.redirect('/viewAdmin');
        }
    } catch (error) {
        res.send(`<h2> Not found: ${error} </h2>`);
    }
};

// edit admin post
const editAdmin = async (req, res) => {
    const editId = req.params.editId;
    try {
        const data = await admin.findById(editId);

        if (req.file) {
            if (data.image)
                fs.unlinkSync(data.image);
            req.body.image = req.file.path;
        } else {
            req.body.image = data.image;
        }
        await admin.findByIdAndUpdate(editId, req.body);
        req.flash('success', ' edit admin successfully!');
        res.redirect('/viewAdmin');
    } catch (error) {
        res.send(`<h2> Not found: ${error} </h2>`);
    }
};

module.exports = {
    loginPage,
    logout,
    userChecked,
    lostPasswordPage,
    checkEmail,
    otpVerifyPage,
    checkOtp,
    newsetpassword,
    checknewpassword,
    changePassword,
    changemypassword,
    viewProfile,
    updateProfile,
    editProfile,
    dashboard,
    addAdminPage,
    viewAdminPage,
    insertAdminData,
    DeleteAdmin,
    UpdateAdmin,
    editAdmin,
};