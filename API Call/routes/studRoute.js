const express = require('express');

const upload = require("../middleware/studMulter");

const route = express.Router();


const { 
  addStud,
  fetchStud,
  fetchoneStud,
  updateStud,
  delStud, } = require("../controllers/studController");

// insert all student
route.post("/addStud", upload.single("image"), addStud);

// fetch allstudentdata 
route.get("/fetchStud", fetchStud);

// fetchSingleStudentdata
route.get("/fetchoneStud/:id", fetchoneStud)

//upadte Student
route.put("/updateStud/:id", upload.single("image"), updateStud)

// delet student
route.delete("/delStud/:id", delStud);

module.exports = route;