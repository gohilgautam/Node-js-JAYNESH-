const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes for Browse restaurants
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Admin-only routes for managing restaurants
router.post('/', auth, authorize(['admin']), restaurantController.createRestaurant);
router.put('/:id', auth, authorize(['admin']), restaurantController.updateRestaurant);
router.delete('/:id', auth, authorize(['admin']), restaurantController.deleteRestaurant);

module.exports = router;    