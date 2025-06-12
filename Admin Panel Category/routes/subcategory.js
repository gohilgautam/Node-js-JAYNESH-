const express = require('express');
const route = express.Router();
const { addSubCategoryPage, insertsubcategory, viewsubcategory, deletesubcategory, updatesubcategory, editsubcategory } = require('../controller/subcategory');
const upload = require('../middleware/subcategoryMulter');

route.get('/addSubCategoryPage', addSubCategoryPage);
route.post('/insertsubcategory', insertsubcategory);
route.get('/viewSubCategoryPage', viewsubcategory);
route.get('/deleteSubCategory/:id', deletesubcategory);
route.get('/updatesubcategory/:id', updatesubcategory);
route.post('/editsubcategory/:id', editsubcategory);

module.exports = route;
