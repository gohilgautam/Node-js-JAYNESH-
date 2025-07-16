const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');


const placeOrder = async (req, res) => {
    try {
        const { restaurantId, items, deliveryAddress, specialInstructions, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'Order must contain at least one item' });
        }
        if (!deliveryAddress || typeof deliveryAddress !== 'string' || deliveryAddress.trim() === '') {
            return res.status(400).json({ msg: 'Delivery address string is required' });
        }
        if (!paymentMethod) {
            return res.status(400).json({ msg: 'Payment method is required' });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItemId);
            if (!menuItem || !menuItem.isAvailable) {
                return res.status(400).json({ msg: `Menu item '${item.menuItemId}' not found or not available` });
            }
            if (menuItem.restaurant.toString() !== restaurantId) {
                return res.status(400).json({ msg: `Menu item '${menuItem.name}' does not belong to the specified restaurant.` });
            }
            if (item.quantity <= 0) {
                 return res.status(400).json({ msg: `Quantity for item '${menuItem.name}' must be at least 1.` });
            }

            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity
            });
            totalAmount += menuItem.price * item.quantity;
        }

        const newOrder = new Order({
            user: req.user.id,
            restaurant: restaurantId,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            specialInstructions,
            paymentMethod,
            paid: paymentMethod !== 'cash_on_delivery'
        });

        await newOrder.save();

        res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('restaurant', 'name address phoneNumber')
            .populate('items.menuItem', 'name price imageUrl')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getOrder= async (req, res) => { 
    try {
        const order = await Order.findById(req.params.id)
            .populate('restaurant', 'name address phoneNumber')
            .populate('items.menuItem', 'name price imageUrl')
            .populate('user', 'name email phoneNumber');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getAllOrders = async (req, res) => { 
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Forbidden: Only administrators can view all orders' });
        }

        const orders = await Order.find()
            .populate('user', 'name email phoneNumber')
            .populate('restaurant', 'name address')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to update this order status' });
        }

        const validStatuses = ['pending', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid order status provided' });
        }

        order.status = status;
        await order.save();
        res.json({ msg: `Order status updated to ${status}`, order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const cancelOrder = async (req, res) => { 
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        if (order.user.toString() === req.user.id) {
            if (order.status === 'pending') {
                order.status = 'cancelled';
                await order.save();
                return res.json({ msg: 'Order cancelled successfully', order });
            } else {
                return res.status(400).json({ msg: `Order cannot be cancelled at status: ${order.status}` });
            }
        }

        if (req.user.role === 'admin') {
            order.status = 'cancelled';
            await order.save();
            return res.json({ msg: 'Order cancelled by admin', order });
        }

        return res.status(403).json({ msg: 'Not authorized to cancel this order' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    placeOrder,
    getUserOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
};