const user = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


exports.registerAdmin = async (req, res) => {
  try {
    if (await user.findOne({ email: req.body.email }))
      res
        .status(401)
        .json({ status: false, error: "You Enter Email Is Allready Existed Plaese Enter Differnt...." });

    req.body.password = await bcrypt.hash(req.body.password, 11);

    (await user.create(req.body))
      ? res
        .status(201)
        .json({ status: true, success: "Admin Register Successfully.." })
      : res
        .status(401)
        .json({ status: false, error: "Admin Registion Failed.." });
  } catch (err) {
    res.status(400).json({
      status: false,
      error: "Something went wrong...",
      error_data: err,
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const adminUserNameData = await adminModel.findOne({
      username: req.body.email,
    });

    if (adminUserNameData) {
      if (await bcrypt.compare(req.body.password, adminUserNameData.password)) {
        const token = jwt.sign(
          { adminData: adminUserNameData },
          process.env.SECRET,
          { expiresIn: "1d" }
        );

        res
          .status(201)
          .json({ login: true, msg: "Login Successfully...", token: token });
      } else
        res.status(201).json({ login: false, msg: "Password is not match.." });
    } else {
      const adminEmailData = await adminModel.findOne({
        email: req.body.email,
      });

      if (adminEmailData) {
        if (await bcrypt.compare(req.body.password, adminEmailData.password)) {
          const token = jwt.sign(
            { adminData: adminEmailData },
            process.env.SECRET,
            { expiresIn: "1d" }
          );
          res
            .status(201)
            .json({ login: true, msg: "Login Successfully...", token: token });
        } else
          res
            .status(201)
            .json({ login: false, msg: "Password is not match.." });
      } else {
        res
          .status(201)
          .json({ login: false, msg: "Username or Email not found..." });
      }
    }
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};

exports.adminProfile = async (req, res) => {
  try {
    res.status(200).json({ msg: "Profile Data...", profile: req.user });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const allAdmin = await user.find({});

    allAdmin
      ? res.status(200).json({
        status: true,
        users: allAdmin,
      })
      : res.status(200).json({
        status: false,
        users: allUsers,
        error: "Admin not found....",
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      error: "Something went wrong...",
      error_data: e,
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const adminData = await adminModel.findById(req.body.id);

    if (!adminData) {
      res.status(200).json({ status: false, msg: "Admin not found...." });
    }

    console.log("Status : ", adminData.status);

    adminData.status = !adminData.status;

    console.log("Updated Date : ", updated_date);

    const updateStatus = await adminModel.findByIdAndUpdate(req.body.id, {
      status: adminData.status,
      updated_date: updated_date,
    });

    updateStatus
      ? res
        .status(200)
        .json({ status: true, msg: "Admin Status is changed..." })
      : res
        .status(200)
        .json({ status: false, msg: "Admin Status is not changed..." });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};

exports.deleteAdmin = async (req, res) => {

  try {
    const adminData = await adminModel.findById(req.body.id);

    if (!adminData) {
      res.status(200).json({ status: false, msg: "Admin not found...." });
    }

    fs.unlinkSync(adminData.image);

    const deleteAdmin = await adminModel.findByIdAndDelete(req.body.id);

    deleteAdmin
      ? res
        .status(200)
        .json({ status: true, msg: "Admin Deleted Successfully..." })
      : res
        .status(200)
        .json({ status: false, msg: "Admin Deletion Failed..." });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};