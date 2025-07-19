const express = require("express");
const route = express.Router();

const auth = require("../middleware/auth.middleware");

const {registerUser, loginUser, getUser, updateUser, deleteUser, userProfile} = require("../controllers/user.controller");

route.post ("/register" , registerUser);

route.post("/login", loginUser);

route.get("/get", auth, getUser);
route.get("/profile", auth, userProfile);

route.put("/updateUser", auth , updateUser);

route.delete("/deleteUser", auth, deleteUser);

module.exports = route;

