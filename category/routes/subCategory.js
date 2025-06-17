const express = require('express');
const route = express.Router();
const { addProductsPage, insertProduct, viewProductPage, deleteProduct, editProductPage, updateProductpage } = require('../controllers/productsControllers');
const uploade = require('../middleware/adminMulter');

route.get('/addProductsPage', addProductsPage);
route.post('/insertProduct', uploade.single('product_image'), insertProduct);
route.get('/viewProductPage', viewProductPage);
route.get('/deleteProduct/:id', deleteProduct);
route.get('/updateProductpage/:id', uploade.single('product_image'), updateProductpage);
route.post('/editProductPage/:id', uploade.single('product_image'), editProductPage);

module.exports = route;