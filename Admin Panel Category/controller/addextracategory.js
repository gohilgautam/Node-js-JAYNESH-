const Category = require("../model/categoryModel");
const SubCategory = require("../model/subCategoryModel");
const extracategory = require('../model/extraCategoryModel');
const product = require('../model/productModel');


// add extra category page render 
const addextracategorypage = async (req, res) => {
    try {
        const currentAdmin = req.user;
        const allCategory = await Category.find({});
        const allSubCategory = await SubCategory.find({});

        if (allCategory && allSubCategory) {
            res.render("extracategory/addExtraCategoryPage", {
                currentAdmin,
                success: req.flash("success"),
                error: req.flash("error"),
                allCategory,
                allSubCategory,
            });
        } else {
            res.redirect("/extracategory/addExtraCategoryPage");
        }
    } catch (e) {
        console.log(e);
        res.redirect("/extracategory/addExtraCategoryPage");
    }
}

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
    console.log("Deleting extracategory with id:", id);
    try {
        const productDeleteData = await product.deleteMany({
            extraCategory_id: id,
        });

        const deleteextraCategory = await extracategory.findByIdAndDelete(id);

        if (deleteextraCategory && productDeleteData) {
            req.flash("success", `${deleteextraCategory.extraCategory_title} deleted successfully.`);
        } else {
            req.flash("error", "ExtraCategory not found.");
        }
    } catch (error) {
        console.log("Error deleting extracategory:", error);
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
        const updateData = await extracategory.findByIdAndUpdate(req.params.id, req.body);
        if (updateData) {
            req.flash("success", "ExtraCategory updated successfully.");
        } else {
            req.flash("error", "ExtraCategory update failed.");
        }
        res.redirect("/extracategory/viewextracategorypage");
    } catch (e) {
        console.error(e);
        req.flash("error", "Server error while updating ExtraCategory.");
        res.redirect("/extracategory/viewextracategorypage");
    }
};


module.exports = {
    addextracategorypage, insertcategory, viewextracategorypage, deleteExtracategory, updateExtracategorypage, editExtraCategory
}