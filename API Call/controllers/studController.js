const studentsModel = require("../models/studModel");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");

// Insert New Student
const addStud = async (req, res) => {

  try {
    req.body.created_date = moment().format("DD/MM/YYYY, h:mm:ss A");
    req.body.updated_date = moment().format("DD/MM/YYYY, h:mm:ss A");

    req.body.password = await bcrypt.hash(req.body.password, 10);


    req.body.image = req.file.path;

    const insertdatastudent = await studentsModel.create(req.body);

    if (insertdatastudent) {
      res.status(201).json({ msg: "student data inserted succussfully..." })
    } else {
      res.status(201).json({ msg: "student data insert faild..." })
    }
  } catch (e) {
    res.status(400).json({ msg: "Something Went Wrong...", error: e });
  }
}

//Fetch All Students

const fetchStud = async (req, res) => {
  try {
    const studentdata = await studentsModel.find({});

    if (studentdata) {
      res.status(200).json({ msg: "Students data is inserted succussfully....", records: studentdata });
    }
    else {
      res.status(200).json({ msg: "Students data not found..." });
    }
  }
  catch (e) {
    res.status(400).json({ msg: "Something Went Wrong...", error: e });
  }
}

//Fetch On Student
const fetchoneStud = async (req, res) => {
  try {
    const singleStudent = await studentsModel.findById(req.params.id);
    if (singleStudent) {
      res.status(200).json(singleStudent);
    } else {
      res.status(200).json({ msg: "Student not found.." });
    }
  } catch (e) {
    res.status(400).json({ msg: "Something Went Wrong...", error: e });
  }
};

//upadet studentdata
const updateStud = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    req.body.updated_date = moment().format("DD/MM/YYYY, h:mm:ss A");

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
    const upadetstudentdata = await studentsModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (upadetstudentdata) {
      res
        .status(200)
        .json({ update: true, msg: "Studentdata  updated is successfully..." });
    } else {
      res
        .status(200)
        .json({ update: false, msg: "Studentdata is  updated failed..." });
    }
  } catch (e) {
    res.status(400).json({ msg: "Something Went Wrong...", error: e });
  }
}

// delete student data
const delStud = async (req, res) => {
  try {
    const deletestudentdata = await studentsModel.findByIdAndDelete(req.params.id);

    if (deletestudentdata) {
      fs.unlinkSync(deletestudentdata.image);

      res.status(200).json({ msg: "Student data deleted successfully." });
    } else {
      res.status(404).json({ msg: "Student not found." });
    }
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong.", error: e.message });
  }
}

module.exports = {
  addStud,
  fetchStud,
  fetchoneStud,
  updateStud,
  delStud,
};
