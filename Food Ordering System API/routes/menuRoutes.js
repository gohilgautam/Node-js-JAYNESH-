const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes for Browse menus
router.get('/restaurants/:restaurantId', menuController.getMenuItemsByRestaurant); // Get menu for a specific restaurant
router.get('/:id', menuController.getMenuItemById); // Get details of a single menu item

// Admin-only routes for managing menu items
router.post('/restaurants/:restaurantId', auth, authorize(['admin']), menuController.addMenuItem);
router.put('/:id', auth, authorize(['admin']), menuController.updateMenuItem);
router.delete('/:id', auth, authorize(['admin']), menuController.deleteMenuItem);

module.exports = router;