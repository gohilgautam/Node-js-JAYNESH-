const express = require("express");

const router = express.Router();

const {
  addSubCategoryPage,
  insertSubCategory,
  viewSubCategoryPage,
  deleteSubCategory,
  updateSubCategoryPage,
  updateSubCategory,
} = require("../controllers/subCategoryController");

// Add SubCategory Page
router.get("/addSubCategoryPage", addSubCategoryPage);

// Insert SubCategory
router.post("/insertSubCategory", insertSubCategory);

// View SubCategory Page
router.get("/viewSubCategoryPage", viewSubCategoryPage);

// delete SubCategory
router.get("/deleteSubCategory/:id", deleteSubCategory);

// update SubCategory Page
router.get("/updateSubCategoryPage/:id", updateSubCategoryPage);

// update SubCategory
router.post("/updateSubCategory/:id", updateSubCategory);

module.exports = router;