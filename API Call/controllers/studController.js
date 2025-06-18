const studentsModel = require("../models/studModel");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");

// Insert New Student
const addStud = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 11);
    // Date And Time Logic
    req.body.created_date = moment().format("MMM/Do/YYYY, h:mm:ss a");
    req.body.updated_date = moment().format("MMM/Do/YYYY, h:mm:ss a");

    req.body.image = req.file.path;

    const insertData = await studentsModel.create(req.body);
    if (insertData) {
      res
        .status(201)
        .json({ insert: true, Message: "Student inserted succussfully🎇🎇..." });
    } else {
      res
        .status(200)
        .json({ insert: false, Message: "Student insertion failed😡😡..." });
    }
  } catch (e) {
    res.status(400).json({ Message: "Something Went Wrong...", error: e });
  }
};

// Fetch All Data Of Students
const fetchStud = async (req, res) => {
  try {
    const studData = await studentsModel.find({});
    if (studData) {
      res
        .status(200)
        .json({ Message: "Students data found Successfully🎇🎇...", records: studData });
    } else {
      res.status(200).json({ Message: "Students data found is Failed😡😡😡😡..." });
    }
  } catch (e) {
    res.status(400).json({ Message: "Something Went Wrong...", error: e });
  }
};

// Fetch Single Student
const fetchoneStud = async (req, res) => {
  try {
    const oneStud = await studentsModel.findById(req.params.id);
    if (oneStud) {
      res.status(200).json(oneStud);
    } else {
      res.status(200).json({ Message: "Student found Failed😡😡.." });
    }
  } catch (e) {
    res.status(400).json({ Message: "Something Went Wrong...", error: e });
  }
};

// Update Student
const updateStud = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    req.body.updated_date = moment().format("MMM/Do/YYYY, h:mm:ss a");

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      const data = await studentsModel.findById(req.params.id);

      if (data) {
        fs.unlinkSync(data.image);
        req.body.image = req.file.path;
      }
    }

    const updatedData = await studentsModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (updatedData) {
      res
        .status(200)
        .json({ update: true, Message: "Student is updated successfully🎇🎇..." });
    } else {
      res
        .status(200)
        .json({ update: false, Message: "Student is not updated..." });
    }
  } catch (e) {
    res.status(400).json({ Message: "Something Went Wrong...", error: e });
  }
};

// Delete Student
const delStud = async (req, res) => {
  try {
    const deletedData = await studentsModel.findByIdAndDelete(req.params.id);

    if (deletedData) {
      fs.unlinkSync(deletedData.image);
      res
        .status(200)
        .json({ delete: true, Message: "Student is deleted successfully🎇🎇🎇🎇..." });
    } else {
      res
        .status(200)
        .json({ delete: false, Message: "Student data is mot deleted😡😡..." });
    }
  } catch (e) {
    res.status(400).json({ Message: "Something Went Wrong...", error: e });
  }
};

module.exports = {
  addStud,
  fetchStud,
  fetchoneStud,
  updateStud,
  delStud,
};
