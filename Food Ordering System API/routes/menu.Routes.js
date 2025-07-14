const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.Controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public routes for Browse menus
router.get('/:restaurantId', menuController.getMenuItemsByRestaurant); 
router.get('/:id', menuController.getMenuItemById); 

// Admin-only routes for managing menu items
router.post('/:restaurantId', auth, authorize(['admin']), menuController.addMenuItem);
router.put('/:id', auth, authorize(['admin']), menuController.updateMenuItem);
router.delete('/:id', auth, authorize(['admin']), menuController.deleteMenuItem);

module.exports = router;