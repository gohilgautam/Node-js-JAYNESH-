const category = require('../model/categoryModel');
const subcategory = require('../model/subCategoryModel');
const extracategory = require('../model/extraCategoryModel');
const product = require('../model/productModel');
const fs = require("fs");

// category page render
const addSubCategoryPage = async (req, res) => {
    const currentAdmin = req.user;
    const allCategory = await category.find({});
    res.render('subcategory/addSubCategoryPage', {
        allCategory: allCategory,
        currentAdmin, success: req.flash("success"),
        error: req.flash("error"),
    })
};

// insert sub category 
const insertsubcategory = async (req, res) => {
    console.log(req.body);

    try {
        const insert = await subcategory.create(req.body);

        if (insert) {
            req.flash("success", "Subcategory inserted...");
        } else {
            req.flash("error", "Subcategory insertion falied...");
        }
        res.redirect("/subcategory/addSubCategoryPage");
    } catch (e) {
        console.log(e);
        req.flash("error", `Exception ${e}`);
        res.redirect("/subcategory/addSubCategoryPage");
    }
}

// view sub category
const viewsubcategory = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const record = await subcategory.find().populate("category_id").exec();

        if (record) {
            res.render("subcategory/viewSubCategoryPage", {
                currentAdmin,
                records: record,
                success: req.flash("success"),
                error: req.flash("error"),
            });
        } else {
            res.redirect("back");
            req.flash("error", "SubCategory not found..");
        }
    } catch (e) {
        console.log(e);
        res.redirect("back");
    }
}

// delete subcategory
const deletesubcategory = async (req, res) => {
    const id = req.params.id;
    console.log("Deleting subcategory with id:", id);

    try {
        const deletExtraCategory = await extracategory.deleteMany({
            subCategory_id: id,
        });

        const productDeleteData = await product.deleteMany({
            subcategory_id: id,
        });

        if (deletExtraCategory && productDeleteData) {
            const deleteSubCategory = await subcategory.findByIdAndDelete(id);
            console.log(deleteSubCategory);
            if (deleteSubCategory) {
                req.flash("success", `${deleteSubCategory.subcategory_title} deleted successfully...`);
            } else {
                req.flash("error", "SubCategory not found or already deleted.");
            }
        }
    } catch (error) {
        console.log("Error deleting subcategory:", error);
        req.flash("error", "Something went wrong while deleting.");
    }
    res.redirect("/subcategory/viewsubcategory");
};

//update category
const updatesubcategory = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const allCategory = await category.find({});
        const updateSubCategory = await subcategory.findById(req.params.id);
        if (allCategory && updateSubCategory) {
            res.render("subcategory/editSubCategorypage", {
                currentAdmin,
                allCategory,
                updateSubCategory,
                success: "",
                error: "",
            })
        }
        else {
            res.redirect("back");
        }
    } catch (e) {
        console.log(e);
        res.redirect("back");
    }

}

// edit sub category
const editsubcategory = async (req, res) => {
    console.log(req.params.id);
    try {
        const updateData = await subcategory.findByIdAndUpdate(req.params.id, req.body);

        if (updateData) {
            req.flash("success", "SubCateory is updated...");
        } else {
            req.flash("error", "SubCateory is not updated...");
        }
        res.redirect("/subcategory/viewsubcategory");
    } catch (e) {
        console.log(e);
        res.redirect("back");
    }
}
module.exports = {
    addSubCategoryPage, insertsubcategory, viewsubcategory, deletesubcategory, updatesubcategory, editsubcategory
} 