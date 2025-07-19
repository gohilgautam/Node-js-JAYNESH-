const express = require("express");
const upload = require("../middleware/admin.multer")
const route = express.Router();

const auth = require("../middleware/auth.middleware");

const {registerAdmin, loginAdmin, getAdmin, adminProfile, updateAdmin, deleteAdmin} = require("../controllers/admin.controller");

route.post("/register", upload.single('image'), registerAdmin);
route.post("/login", loginAdmin);

route.get("/get", auth, getAdmin);  
route.get("/profile", auth, adminProfile);  

route.put("/updateAdmin", auth , updateAdmin);

route.delete("/deleteAdmin", auth, deleteAdmin);



module.exports = route;

