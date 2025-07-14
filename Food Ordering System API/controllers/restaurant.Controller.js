const Restaurant = require('../models/restaurant.Model');

// @route   POST /api/restaurants
// @desc    Create a new restaurant
// @access  Private (Admin only)
const createRestaurant = async (req, res) => { // Changed to const
    try {
        const { name, address, phoneNumber, description } = req.body;

        const existingRestaurant = await Restaurant.findOne({ name });
        if (existingRestaurant) {
            return res.status(400).json({ msg: 'Restaurant with this name already exists' });
        }

        const newRestaurant = new Restaurant({
            name,
            address,
            phoneNumber,
            description,
            owner: req.user.id
        });
        await newRestaurant.save();
        res.status(201).json(newRestaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/restaurants
// @desc    Get all restaurants
// @access  Public
const getAllRestaurants = async (req, res) => { // Changed to const
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID
// @access  Public
const getRestaurantById = async (req, res) => { // Changed to const
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant details
// @access  Private (Admin only)
const updateRestaurant = async (req, res) => { // Changed to const
    try {
        let restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        res.json(restaurant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE /api/restaurants/:id
// @desc    Delete a restaurant
// @access  Private (Admin only)
const deleteRestaurant = async (req, res) => { // Changed to const
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ msg: 'Restaurant not found' });
        }

        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Restaurant removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Export all functions at once
module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};