const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.Middleware');

const {
    restaurantMenu,
    getMenuItem,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require("../controllers/menu.Controller");

// Public routes for Browse menus
router.get('/restaurant/:Id', restaurantMenu); 
router.get('/getMenuItem/:id', getMenuItem); 

// Admin-only routes for managing menu items
router.post('/restaurant/:Id', auth, addMenuItem);
router.put('/updateMenuItem/:id', auth, updateMenuItem);
router.delete('/deleteMenuItem/:id', auth, deleteMenuItem);

module.exports = router;