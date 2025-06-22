const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const extracategory = require('../models/extraCategoryModel');
const product = require('../models/productsModel');
const fs = require('fs');

// add extra category page render 
const addextracategorypage = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const allCategory = await Category.find({});
        const allSubCategory = await SubCategory.find({});

        console.log("Category Data:", allCategory);
        console.log("SubCategory Data:", allSubCategory);

        res.render("extracategory/addExtraCategoryPage", {
            currentAdmin,
            success: req.flash("success"),
            error: req.flash("error"),
            allCategory,
            allSubCategory,
        });
    } catch (e) {
        console.log(e);
        res.redirect("/extracategory/addExtraCategoryPage");
    }
};

// insert extra category
const insertcategory = async (req, res) => {
    try {
        const insertExtraCategory = await extracategory.create(req.body);
        if (insertExtraCategory) {
            req.flash("success", `${req.body.extraCategory_title} is inserted `);
        }
        else {
            req.flash("error", `${req.body.extraCategory_title} is intertion failed `);
        }
        res.redirect('/extracategory/addextracategoryPage')
    } catch (error) {
        console.log(error);
    }

}

// view extracategory
const viewextracategorypage = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const allExtraCategory = await extracategory.find()
            .populate("category_id")
            .populate("subCategory_id");

        console.log(allExtraCategory);
        if (allExtraCategory) {
            res.render("extracategory/viewExtraCategoryPage", {
                success: req.flash("success"),
                error: req.flash("error"),
                allExtraCategory,
                currentAdmin
            });
        }
        else {
            res.redirect("/extracategory/viewExtraCategoryPage");
        }
    } catch (e) {
        console.log(e);
        res.redirect("/extracategory/viewExtraCategoryPage");
    }
}

// delete extracetegory 
const deleteExtracategory = async (req, res) => {
    const id = req.params.id;
    console.log("🟡 Received ID to delete:", id);

    try {
        // Check if ExtraCategory exists
        const existing = await extracategory.findById(id);
        console.log("🔍 ExtraCategory found:", existing);

        if (!existing) {
            req.flash("error", "ExtraCategory not found.");
            return res.redirect("/extracategory/viewextracategorypage");
        }

        // Delete related products
        const productDeleteData = await product.deleteMany({ extraCategory_id: id });
        console.log("🗑️ Related products deleted:", productDeleteData.deletedCount);

        // Delete ExtraCategory
        const deleteextraCategory = await extracategory.findByIdAndDelete(id);
        console.log("✅ ExtraCategory deleted:", deleteextraCategory);

        req.flash("success", `${deleteextraCategory.extraCategory_title} deleted successfully.`);
    } catch (error) {
        console.log("❌ Error deleting extracategory:", error);
        req.flash("error", "Something went wrong while deleting.");
    }

    res.redirect("/extracategory/viewextracategorypage");
};

// update extracategory
const updateExtracategorypage = async (req, res) => {
    try {
        const id = req.params.id;
        const currentAdmin = req.user;

        const allCategory = await Category.find({});
        const allSubCategory = await SubCategory.find({});
        const updateExtraCategory = await extracategory.findById(id);

        if (!updateExtraCategory) {
            req.flash("error", "ExtraCategory not found");
            return res.redirect("/extracategory/updateExtracategorypage");
        }

        res.render('extracategory/updateExtracategorypage', {
            currentAdmin,
            success: req.flash("success"),
            error: req.flash("error"),
            allCategory,
            allSubCategory,
            updateExtraCategory
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Server error");
        res.redirect("/extracategory/updateExtracategorypage");
    }
};

// Edit ExtraCategory
const editExtraCategory = async (req, res) => {
    try {
        console.log("Form data:", req.body);  // 👈 Check this
        const updated = await extracategory.findByIdAndUpdate(req.params.id, req.body);
        if (updated) {
            req.flash("success", "ExtraCategory updated successfully.");
        } else {
            req.flash("error", "ExtraCategory update failed.");
        }
        res.redirect("/extracategory/viewextracategorypage");
    } catch (e) {
        console.error("Update error:", e);
        req.flash("error", "Server error while updating ExtraCategory.");
        res.redirect("/extracategory/viewextracategorypage");
    }
};

module.exports = {
    addextracategorypage, insertcategory, viewextracategorypage, deleteExtracategory, updateExtracategorypage, editExtraCategory
}