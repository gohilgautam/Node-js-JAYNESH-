const express = require("express");

const route = express.Router();

const {
  addStud,
  fetchStud,
  fetchoneStud,
  updateStud,
  delStud,
} = require("../controllers/studController");

const uploads = require("../middleware/studMulter");

// Insert Student
route.post("/addstud", uploads.single("image"), addStud);

// Fetch Students
route.get("/fetchstud", fetchStud);

// Fetch Single Students
route.get("/fetchoneStud/:id", fetchoneStud);

// Update Student
route.put("/updatestud/:id", uploads.single("image"), updateStud);

// Delete Student
route.delete("/deletestud/:id", delStud);

module.exports = route;
