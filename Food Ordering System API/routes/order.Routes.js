const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.Controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Customer routes (require authentication)
router.post('/', auth, orderController.placeOrder);
router.get('/my', auth, orderController.getUserOrders); 
router.get('/:id', auth, orderController.getOrderById); 
router.put('/:id/cancel', auth, orderController.cancelOrder);

// Admin routes for order management
router.get('/', auth, orderController.getAllOrders); 
router.put('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;