const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.Controller");
const auth = require("../middleware/auth.Middleware");

// Public routes for Browse restaurants
router.get("/allRestaurant", restaurantController.getAllRestaurants);
router.get("/fetchOneRestaurant/:id", restaurantController.getRestaurantById);

// Admin-only routes for managing restaurants
router.post("/createRes", auth, restaurantController.createRestaurant);
router.put("/updateRes/:id", auth, restaurantController.updateRestaurant);
router.delete("/deleteRes/:id", auth, restaurantController.deleteRestaurant);

module.exports = router;
