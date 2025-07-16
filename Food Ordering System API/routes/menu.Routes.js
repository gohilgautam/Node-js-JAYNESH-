const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.Controller');
const auth = require('../middleware/auth.Middleware');

// Public routes for Browse menus
router.get('/restaurant/:Id', menuController.getMenuItemsByRestaurant); 
router.get('/getMenuItem/:id', menuController.getMenuItem); 

// Admin-only routes for managing menu items
router.post('/restaurant/:Id', auth, menuController.addMenuItem);
router.put('/updateMenuItem/:id', auth, menuController.updateMenuItem);
router.delete('/deleteMenuItem/:id', auth, menuController.deleteMenuItem);

module.exports = router;