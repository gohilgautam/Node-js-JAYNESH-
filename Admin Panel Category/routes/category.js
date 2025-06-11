const express = require('express');
const route = express.Router();
const upload = require('../middleware/categoryMulter'); // Assuming this path is correct
const { addCategoryPage, insertCategory, viewCategoryPage, deleteCategory, editCategoryPage, updateCategory } = require('../controllers/categoryController'); // Assuming this path is correct

// Add Category Page
route.get('/addCategoryPage', addCategoryPage);
route.post('/insertCategory', upload.single('c_image'), insertCategory);

// View Category Page
route.get('/viewCategoryPage', viewCategoryPage);

// Delete Category
route.get('/deleteCategory/:id', deleteCategory);

// Edit Category Page
route.get('/editCategoryPage', editCategoryPage);

// Update Category
route.post('/updateCategory/:id', upload.single('c_image'), updateCategory);

module.exports = route;