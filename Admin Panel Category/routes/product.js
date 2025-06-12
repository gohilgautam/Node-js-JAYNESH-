const express = require('express');
const route = express.Router();
const { addproductPage, insertProduct, viewProductPage, deleteProduct, editProductPage, updateProductpage } = require('../controller/product');
const uploade = require('../middleware/product');

route.get('/addproductPage', addproductPage);
route.post('/insertProduct', uploade.single('product_image'), insertProduct);
route.get('/viewProductsPage', viewProductPage);
route.get('/deleteProduct/:id', deleteProduct);
route.get('/updateProductpage/:id', updateProductpage);
route.post('/editProductPage/:id', uploade.single('product_image'), editProductPage);

module.exports = route;