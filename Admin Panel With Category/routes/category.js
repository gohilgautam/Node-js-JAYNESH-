
const express = require('express');

const router = express.Router();

const upload = require('../middleware/categoryMulter');

const { addCategoryPage, insertCategory, viewCategoryPage, deleteCategory, editCategoryPage, updateCategory } = require('../controllers/categoryController');

// Add Category Page
router.get('/addCategoryPage', addCategoryPage);
router.post('/insertCategory', upload.single('c_image'), insertCategory);

// View Category Page
router.get('/viewCategoryPage', viewCategoryPage);

// Delete Category
router.get('/deleteCategory/:id', deleteCategory);

// Edit Category Page
router.get('/editCategoryPage', editCategoryPage);

// Update Category
router.post('/updateCategory/:id', upload.single('c_image'), updateCategory);

module.exports = router;