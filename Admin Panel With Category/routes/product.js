const express = require("express");

const router = express.Router();

const {
  addProductPage,
  insertProduct,
  viewProductPage,
} = require("../controllers/productController");

const upload = require("../middleware/productMulter");

// Add Product Page
router.get("/addProductPage", addProductPage);
// Insert Product
router.post("/insertProduct", upload.single("product_image"), insertProduct);

// View Products
router.get("/viewProductsPage", viewProductPage);
module.exports = router;