
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const extracategory = require('../models/extraCategoryModel');
const product = require('../models/productsModel');
const fs = require('fs')

// add product page render 
const addProductsPage = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const allCategory = await Category.find();
        const allSubCategory = await SubCategory.find();
        const allExtraCategory = await extracategory.find();

        if (allCategory && allSubCategory && allExtraCategory) {
            res.render("products/addProductsPage", {
                success: req.flash("success"),
                error: req.flash("error"),
                currentAdmin,
                allCategory,
                allSubCategory,
                allExtraCategory,
            });
        } else {
            res.redirect("/products/addProductsPage");
        }
    } catch (e) {
        console.log(e);
        res.redirect("/products/addProductsPage");
    }
}

// insert product
const insertProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.product_image = req.file.path;
        } else {
            req.flash("error", "Product image is required.");
            return res.redirect("/product/addProductsPage");
        }
        const insertproduct = await product.create(req.body);
        if (insertproduct) {
            req.flash("success", `${req.body.product_name} is inserted`);
        } else {
            req.flash("error", `${req.body.product_name} insertion failed`);
        }

        res.redirect('/product/addProductsPage');
    } catch (error) {
        console.log(error);
        req.flash("error", "Something went wrong");
        res.redirect("/product/addProductsPage");
    }
};

// view product page
const viewProductPage = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const allProducts = await product.find()
            .populate("category_id")
            .populate("subcategory_id")
            .populate("extracategory_id");

        if (allProducts) {
            res.render("products/viewProductsPage", {
                allProducts,
                currentAdmin,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } else {
            res.redirect("/products/viewProductsPage");
        }
    } catch (e) {
        console.log(e);
        res.redirect("/products/viewProductsPage");
    }
}

// delete product
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
        const productData = await product.findById(req.params.id)
            .populate("category_id")
            .populate("subcategory_id")
            .populate("extracategory_id");
        const allCategory = await Category.find();
        const allSubCategory = await SubCategory.find();
        const allExtraCategory = await extracategory.find();
        const allproduct = await product.findById(id);
        res.render('products/editProductsPage', {
            currentAdmin,
            success: req.flash("success"),
            error: req.flash("error"),
            allCategory,
            allSubCategory,
            allExtraCategory: allExtraCategory,
            allproduct
        });

    } catch (error) {
        console.error(error);
        req.flash("error", "Server error");
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
    addProductsPage,
    insertProduct,
    viewProductPage,
    deleteProduct,
    updateProductpage,
    editProductPage
}