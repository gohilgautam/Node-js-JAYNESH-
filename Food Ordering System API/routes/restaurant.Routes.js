const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.Middleware");

const {
    getAllRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant
} = require("../controllers/restaurant.Controller");


// Public routes for Browse restaurants
router.post("/createRes", auth, createRestaurant);
router.get("/allRestaurant", getAllRestaurants);
router.get("/fetchOneRestaurant/:id", getRestaurantById);

// Admin-only routes for managing restaurants
router.put("/updateRes/:id", auth, updateRestaurant);
router.delete("/deleteRes/:id", auth, deleteRestaurant);

module.exports = router;
