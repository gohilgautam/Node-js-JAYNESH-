const express = require("express");

const route = express.Router();

const {
  addProductPage,
  insertProduct,
  viewProductPage,
  editProductPage,
  updateProductpage,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/productMulter");

// Add Product Page
route.get("/addProductPage", addProductPage);
// Insert Product
route.post("/insertProduct", upload.single("product_image"), insertProduct);

// View Products
route.get("/viewProductsPage", viewProductPage);

//Delete Product
route.get('/deleteProduct/:id', deleteProduct);

// Update Product
route.get('/updateProductpage/:id', updateProductpage);

//Edit Product
route.post('/editProductPage/:id', upload.single('product_image'), editProductPage);

module.exports = route;
