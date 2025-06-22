console.log("Controller is runnign...");

const category = require('../models/categoryModel');
const subcategory = require('../models/subcategoryModel');
const extracategory = require('../models/extraCategoryModel');
const product = require('../models/productsModel');
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
        const subcategories = await subcategory.find().populate("category_id");

        res.render("subcategory/viewSubCategoryPage", {
            currentAdmin,
            subcategories,
            success: req.flash("success"),
            error: req.flash("error"),
        });
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong.");
        res.redirect("back");
    }
};


// delete subcategory
const deletesubcategory = async (req, res) => {
    const id = req.params.id;
    console.log("Deleting subcategory with id:", id);

    try {
        await extracategory.deleteMany({ subCategory_id: id });
        await product.deleteMany({ subcategory_id: id });

        const deleteSubCategory = await subcategory.findByIdAndDelete(id);
        if (deleteSubCategory) {
            req.flash("success", `${req.body.deleteSubCategory.name} deleted successfully...`);
        } else {
            req.flash("error", "SubCategory not found or already deleted.");
        }
    } catch (error) {
        console.log("Error deleting subcategory:", error);
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