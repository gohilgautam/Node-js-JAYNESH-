const category = require("../models/categoryModel");
const subCategory = require("../models/subCategoryModel");
const extracategory = require("../models/extraCategoryModel");
const products = require("../models/productsModel");
const mongoose = require("mongoose");
const fs = require("fs");

// Add Category Page Render
const addCategoryPage = (req, res) => {
  res.render("category/addCategoryPage", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
};
// Insert Category Page
const insertCategory = async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    req.body.c_image = req.file.path;
    const insert = await category.create(req.body);

    if (insert) {
      req.flash("success", "Category Inserted...");
    } else {
      req.flash("error", "Category Insertion failed...");
    }
    res.redirect("/category/addCategoryPage");
  } catch (e) {
    req.flash("error", `Exception : ${e}`);
    res.redirect("/category/addCategoryPage");
  }
};

// View Category Page Render
const viewCategoryPage = async (req, res) => {
  try {
    const allcategory = await category.find({});

    if (allcategory) {
      res.render("category/viewCategoryPage", {
        records: allcategory,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } else {
      req.flash("error", "No Category Found....");
    }
  } catch (e) {
    console.log(e);
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  console.log(req.params);

  try {
    const subCategoryDeleteData = await subCategory.deleteMany({
      category_id: req.params.id,
    });

    const extraCategoryDeleteData = await extracategory.deleteMany({
      category_id: req.params.id,
    });

    const productDeleteData = await products.deleteMany({
      category_id: req.params.id,
    });

    if (subCategoryDeleteData && extraCategoryDeleteData && productDeleteData) {
      const deleteData = await category.findByIdAndDelete({
        _id: req.params.id,
      });
      console.log("Deleted Data", deleteData);

      if (deleteData) {
        fs.unlinkSync(deleteData.c_image);
        req.flash("success", "Category Deleted....");
      } else {
        req.flash("error", "Category Not Deleted...");
      }
    } else {
      req.flash("error", "Category Not Deleted...");
    }

    req.redirect("/category/viewCategoryPage");
  } catch (e) {
    console.log(e);
    res.redirect("/category/viewCategoryPage");
  }
};

// Update Category Page
const editCategoryPage = async (req, res) => {
  try {
    console.log(req.query.id);

    const data = await category.findById(req.query.id);

    console.log("Edit Data", data);

    if (data) {
      res.render("category/editCategoryPage", {
        data: data,
        success: "",
        error: "",
      });
    } else {
      res.redirect("back");
    }
  } catch (e) {
    console.log(e);

    res.redirect("back");
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    console.log(req.file);

    const data = await category.findById(req.params.id);

    if (req.file) {
      console.log("Request File Called....");

      fs.unlinkSync(data.c_image);

      req.body.c_image = req.file.path;

      const updateData = await category.findByIdAndUpdate(
        req.params.id,
        req.body
      );

      console.log("Update Data ", updateData);

      if (updateData) {
        req.flash("success", "Category updated successfully...");
      } else {
        req.flash("error", "Category updation failed...");
      }
    } else {
      console.log("Not File Called....");

      if (data) {
        req.body.c_image = data.c_image;

        const updateData = await category.findByIdAndUpdate(
          req.params.id,
          req.body
        );
        console.log("Update Data ", updateData);

        if (updateData) {
          req.flash("success", "Category updated successfully...");
        } else {
          req.flash("error", "Category updation failed...");
        }
      } else {
        req.flash("error", "Data not found...");
      }
    }

    res.redirect("/category/viewCategoryPage");
  } catch (e) {
    console.log("Exception", e);
    res.redirect("back");
  }
};

module.exports = {
  addCategoryPage,
  insertCategory,
  viewCategoryPage,
  deleteCategory,
  editCategoryPage,
  updateCategory,
};