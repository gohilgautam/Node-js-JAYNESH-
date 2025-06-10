const express = require("express");

const route = express.Router();

console.log("Routing...");

const { fetchUser, insertUser,deleteUser,updateUsers } = require("../controllers/usersController");

//Fetch Users
route.get("/users", fetchUser);

//Insert User
route.post("/users", insertUser);

//Delete User
route.delete("/users/:id", deleteUser);

//Update User
route.patch("/users/:id" , updateUsers);

module.exports = route;