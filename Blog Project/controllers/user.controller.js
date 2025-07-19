const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
  try {
    if (await user.findOne({ email: req.body.email }))
      res
        .status(401)
        .json({ status: false, error: "You Enter Email Is Allready Existed Plaese Enter Differnt...." });

    req.body.password = await bcrypt.hash(req.body.password, 11);

    (await user.create(req.body))
      ? res
        .status(201)
        .json({ status: true, success: "User Register Successfully.." })
      : res
        .status(401)
        .json({ status: false, error: "User Registion Failed.." });
  } catch (err) {
    res.status(400).json({
      status: false,
      error: "Something went wrong...",
      error_data: err,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const userUserNameData = await userModel.findOne({
      username: req.body.email,
    });

    if (userUserNameData) {
      if (await bcrypt.compare(req.body.password, userUserNameData.password)) {
        const token = jwt.sign(
          { userData: userUserNameData },
          process.env.SECRET,
          { expiresIn: "1d" }
        );

        res
          .status(201)
          .json({ login: true, msg: "Login Successfully...", token: token });
      } else
        res.status(201).json({ login: false, msg: "Password is not match.." });
    } else {
      const userEmailData = await userModel.findOne({
        email: req.body.email,
      });

      if (userEmailData) {
        if (await bcrypt.compare(req.body.password, userEmailData.password)) {
          const token = jwt.sign(
            { userData: userEmailData },
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


exports.userProfile = async (req, res) => {
  try {
    res.status(200).json({ msg: "Profile Data...", profile: req.user });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};

exports.getUser = async (req, res) => {
  try {
    const alluser = await user.find({});

    alluser
      ? res.status(200).json({
        status: true,
        users: alluser,
      })
      : res.status(200).json({
        status: false,
        users: allUsers,
        error: "user not found....",
      });
  } catch (e) {
    res.status(400).json({
      status: false,
      error: "Something went wrong...",
      error_data: e,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.id);

    if (!userData) {
      res.status(200).json({ status: false, msg: "user not found...." });
    }

    console.log("Status : ", userData.status);

    userData.status = !userData.status; // status = !true
    const updated_date = moment().format("DD/MM/YYYY, h:mm:ss A");

    console.log("Updated Date : ", updated_date);

    const updateStatus = await userModel.findByIdAndUpdate(req.body.id, {
      status: userData.status,
      updated_date: updated_date,
    });

    updateStatus
      ? res
        .status(200)
        .json({ status: true, msg: "user Status is changed..." })
      : res
        .status(200)
        .json({ status: false, msg: "user Status is not changed..." });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};

exports.deleteUser = async (req, res) => {

  try {
    const userData = await userModel.findById(req.body.id);

    if (!userData) {
      res.status(200).json({ status: false, msg: "user not found...." });
    }

    fs.unlinkSync(userData.image);

    const deleteuser = await userModel.findByIdAndDelete(req.body.id);

    deleteuser
      ? res
        .status(200)
        .json({ status: true, msg: "user Deleted Successfully..." })
      : res
        .status(200)
        .json({ status: false, msg: "user Deletion Failed..." });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong...", error: e });
  }
};