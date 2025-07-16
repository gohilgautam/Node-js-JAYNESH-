const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.Controller');
const auth = require('../middleware/auth.Middleware');

// Customer routes (require authentication)
router.post('/placeOrder', auth, orderController.placeOrder);
router.get('/getUserOrders', auth, orderController.getUserOrders); 
router.get('/getOrder/:id', auth, orderController.getOrder); 
router.put('/cancel/:id', auth, orderController.cancelOrder);

// Admin routes for order management
router.get('/getAllOrsers', auth, orderController.getAllOrders); 
router.put('/status/:id', auth, orderController.updateOrderStatus);

module.exports = router;