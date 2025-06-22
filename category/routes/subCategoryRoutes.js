const express = require("express");

const route = express.Router();

const upload = require("../middleware/subCategoryMulter");

const { addSubCategory, subCategoryInsert, viewSubCategoryPage, editSubCategoryPage, updateSubCategory, deleteSubCategory } = require("../controllers/subCategoryCTR");

// Add Category Page
route.get('/addSubCategoryPage', addSubCategory);
route.post('/subCategoryInsert', upload.single('subCategory_image'), subCategoryInsert)

// // View Category Page
route.get('/viewSubCategoryPage', viewSubCategoryPage);


// // Edit Category
route.get('/editSubCategoryPage/:id', editSubCategoryPage);
route.post('/updateSubCategory/:id', upload.single('subCategory_image'), updateSubCategory);


// // Delete Category
route.get('/deleteSubCategory/:id', deleteSubCategory);

module.exports = route;