const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Customer routes (require authentication)
router.post('/', auth, orderController.placeOrder); // Place a new order
router.get('/my', auth, orderController.getUserOrders); // Get orders for the logged-in user
router.get('/:id', auth, orderController.getOrderById); // Get a specific order (if owned by user or if admin)
router.put('/:id/cancel', auth, orderController.cancelOrder); // Cancel an order

// Admin routes for order management
router.get('/', auth, authorize(['admin']), orderController.getAllOrders); // Get all orders (admin only)
router.put('/:id/status', auth, authorize(['admin']), orderController.updateOrderStatus); // Update order status (admin only)

module.exports = router;