const express = require("express");

const router = express.Router();

const {
  addExtraCategoryPage,
  insertExtraCategory,
  viewExtraCategoryPage,
} = require("../controllers/extraCategoryController");

// Add Extra Category Page
router.get("/addExtraCategoryPage", addExtraCategoryPage);

// Insert Extra Category
router.post("/insertExtraCategory", insertExtraCategory);

// View Extra Category Page
router.get("/viewExtraCategoryPage", viewExtraCategoryPage);

module.exports = router;