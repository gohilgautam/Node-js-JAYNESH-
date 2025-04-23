const School = require('../models/schoolModel');

// Render the main school page
const schoolPage = (req, res) => {
    res.render('School'); 
};

// Get all schools
const formPage = async (req, res) => {
    try {
        const schools = await School.find();
        res.render('School', { schools });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Get a single school by ID
const getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).send('School not found');
        }
        res.render('upSchool', { school });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Create a new school
const createSchool = async (req, res) => {
    try {
        console.log('Received form data:', req.body);
        const newSchool = new School(req.body);
        await newSchool.save();
        res.redirect('/school');
    } catch (error) {
        console.error('Error creating school:', error);
        if (error.name === 'ValidationError') {
            let messages = [];
            for (field in error.errors) {
                messages.push(error.errors[field].message);
            }
            res.status(400).send('Validation error: ' + messages.join(', '));
        } else {
            res.status(400).send(error.message);
        }
    }
};

// Update an existing school
const updateSchool = async (req, res) => {
    try {
        const updatedSchool = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSchool) {
            return res.status(404).send('School not found');
        }
        res.redirect('/school');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Delete a school
const deleteSchool = async (req, res) => {
    try {
        const deletedSchool = await School.findByIdAndDelete(req.params.id);
        if (!deletedSchool) {
            return res.status(404).send('School not found');
        }
        res.redirect('/school');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    schoolPage,
    formPage,
    getSchoolById,
    createSchool,
    updateSchool,
    deleteSchool,
};
