const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @route   POST /api/menu-items/restaurants/:restaurantId
// @desc    Add a new menu item to a specific restaurant
// @access  Private (Admin only)
const addMenuItem = async (req, res) => { // Changed to const
    try {
        const { restaurantId } = req.params;
        const { name, description, price, category, imageUrl, isAvailable } = req.body;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to add menu items to this restaurant' });
        }

        const newMenuItem = new MenuItem({
            restaurant: restaurantId,
            name,
            description,
            price,
            category,
            imageUrl,
            isAvailable: isAvailable !== undefined ? isAvailable : true
        });

        await newMenuItem.save();
        res.status(201).json(newMenuItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/menu-items/restaurants/:restaurantId
// @desc    Get all menu items for a specific restaurant
// @access  Public (Menu Browse)
const getMenuItemsByRestaurant = async (req, res) => { // Changed to const
    try {
        const { restaurantId } = req.params;
        const menuItems = await MenuItem.find({ restaurant: restaurantId, isAvailable: true });
        if (menuItems.length === 0) {
            return res.status(404).json({ msg: 'No menu items found for this restaurant or restaurant not found' });
        }
        res.json(menuItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/menu-items/:id
// @desc    Get a single menu item by ID
// @access  Public
const getMenuItemById = async (req, res) => { // Changed to const
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ msg: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/menu-items/:id
// @desc    Update an existing menu item
// @access  Private (Admin only)
const updateMenuItem = async (req, res) => { // Changed to const
    try {
        let menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ msg: 'Menu item not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to update this menu item' });
        }

        menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        res.json(menuItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/menu-items/:id
// @desc    Delete a menu item
// @access  Private (Admin only)
const deleteMenuItem = async (req, res) => { // Changed to const
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ msg: 'Menu item not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to delete this menu item' });
        }

        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Menu item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Export all functions at once
module.exports = {
    addMenuItem,
    getMenuItemsByRestaurant,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
};