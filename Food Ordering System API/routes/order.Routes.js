const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.Middleware');

const {
    placeOrder, getUserOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus
} = require("../controllers/order.Controller");

// Customer routes (require authentication)
router.post('/placeOrder', auth, placeOrder);
router.get('/getUserOrders', auth, getUserOrders);
router.get('/getOrder/:id', auth, getOrder);
router.put('/cancel/:id', auth, cancelOrder);

// Admin routes for order management
router.get('/getAllOrsers', auth, getAllOrders);
router.put('/status/:id', auth, updateOrderStatus);

module.exports = router;