const category = require("../models/CategoryModel");
const subCategory = require("../models/SubCategoryModel");
const extraCategory = require("../models/ExtraCategoryModel");
const products = require("../models/productModel");

// Add Product Page
const addProductPage = async (req, res) => {
  try {
    const allCategory = await category.find();
    const allSubCategory = await subCategory.find();
    const allExtraCategory = await extraCategory.find();

    if (allCategory && allSubCategory && allExtraCategory) {
      res.render("products/addProductPage", {
        success: req.flash("success"),
        error: req.flash("error"),
        allCategory,
        allSubCategory,
        allExtraCategory,
      });
    } else {
      res.redirect("back");
    }
  } catch (e) {
    console.log(e);
    res.redirect("back");
  }
};

// Insert Product
const insertProduct = async (req, res) => {
  console.log(req.body);
  try {
    req.body.product_image = req.file.path;
    const productInsert = await products.create(req.body);

    if (productInsert) {
      req.flash("success", "Product is inserted...");
    } else {
      req.flash("error", "Product is insertion failed...");
    }
    res.redirect("back");
  } catch (e) {
    console.log(e);
  }
};

// View Products
const viewProductPage = async (req, res) => {
  try {
    const allProducts = await products
      .find()
      .populate("category_id")
      .populate("subcategory_id")
      .populate("extracategory_id");

    console.log(allProducts);

    if (allProducts) {
      res.render("products/viewProductsPage", {
        allProducts,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } else {
      res.redirect("back");
    }
  } catch (e) {
    console.log(e);
    res.redirect("back");
  }
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const deleteProduct = await product.findByIdAndDelete(id);
        if (deleteProduct) {
            req.flash("success", `${deleteProduct.product_name} deleted successfully.`);
        } else {
            req.flash("error", "Product not found.");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong while deleting.");
    }
    res.redirect("/product/viewProductPage");
}

// update product page
const updateProductpage = async (req, res) => {
    try {
        const id = req.params.id;
        const currentAdmin = req.user;

        const allCategory = await Category.find();
        const allSubCategory = await SubCategory.find();
        const allExtraCategory = await extracategory.find();
        const allProduct = await product.findById(id);

        if (!allProduct) {
            req.flash("error", "Product not found");
            return res.redirect("/product/viewProductPage");
        }

        res.render('product/editProductPage', {
            currentAdmin,
            success: req.flash("success"),
            error: req.flash("error"),
            allCategory,
            allSubCategory,
            allExtraCategory,
            allProduct
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Server error");
        res.redirect("/product/viewProductPage");
    }
};

// edit product 
const editProductPage = async (req, res) => {
    try {
        const id = req.params.id;
        const existingProduct = await product.findById(id);

        if (!existingProduct) {
            req.flash("error", "Product not found");
            return res.redirect("/product/viewProductPage");
        }
        if (req.file) {
            if (existingProduct.product_image) {
                fs.unlinkSync(existingProduct.product_image);
            }
            req.body.product_image = req.file.path;
        }

        const updatedProduct = await product.findByIdAndUpdate(id, req.body);

        req.flash("success", "Product updated successfully");
        res.redirect("/product/viewProductPage");

    } catch (error) {
        console.error(error);
        req.flash("error", "Error updating product");
        res.redirect("/product/viewProductPage");
    }
};

module.exports = {
  addProductPage,
  insertProduct,
  viewProductPage,
  deleteProduct,
  updateProductpage,
  editProductPage
};
