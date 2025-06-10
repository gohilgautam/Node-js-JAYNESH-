const Category = require("../models/CategoryModel");
const SubCategory = require("../models/SubCategoryModel");
const ExtraCategory = require("../models/ExtraCategoryModel");

// Add Extra Category Page
const addExtraCategoryPage = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    const allSubCategory = await SubCategory.find({});

    if (allCategory && allSubCategory) {
      res.render("extracategory/addExtraCategoryPage", {
        success: req.flash("success"),
        error: req.flash("error"),
        allCategory,
        allSubCategory,
      });
    } else {
      res.redirect("back");
    }
  } catch (e) {
    console.log(e);
    res.redirect("back");
  }
};

// Insert Extra Categoru
const insertExtraCategory = async (req, res) => {
  console.log(req.body);

  try {
    const insertExtraCategory = await ExtraCategory.create(req.body);

    insertExtraCategory
      ? req.flash("success", `${req.body.extraCategory_title} is interted...`)
      : req.flash(
          "error",
          `${req.body.extraCategory_title} is intertion failed...`
        );

    res.redirect("back");
  } catch (e) {
    console.log(e);
    res.redirect("back");
  }
};

// View Extra Category Page
const viewExtraCategoryPage = async (req, res) => {
  try {
    const allExtraCategory = await ExtraCategory.find()
      .populate("category_id")
      .populate("subCategory_id");

    console.log(allExtraCategory);

    allExtraCategory
      ? res.render("extracategory/viewExtraCategoryPage", {
          success: req.flash("success"),
          error: req.flash("error"),
          allExtraCategory,
        })
      : res.redirect("back");
  } catch (e) {
    console.log(e);
    res.redirect("back");
  }
};

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
const updateExtracategory = async (req, res) => {
    try {
        const id = req.params.id;
        const currentAdmin = req.user;

        const allCategory = await Category.find({});
        const allSubCategory = await SubCategory.find({});
        const updateExtraCategory = await extracategory.findById(id);

        if (!updateExtraCategory) {
            req.flash("error", "ExtraCategory not found");
            return res.redirect("/extracategory/updateExtracategory");
        }

        res.render('extracategory/updateExtracategory', {
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
        res.redirect("/extracategory/updateExtracategory");
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
  addExtraCategoryPage,
  insertExtraCategory,
  viewExtraCategoryPage,
  deleteExtracategory,
  updateExtracategory,
  editExtraCategory,
};
