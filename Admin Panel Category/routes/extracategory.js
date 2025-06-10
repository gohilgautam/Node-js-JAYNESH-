const express = require("express");

const route = express.Router();

const {
  addExtraCategoryPage,
  insertExtraCategory,
  viewExtraCategoryPage,
  deleteExtracategory,
  updateExtracategory,
  editExtraCategory,
} = require("../controllers/extraCategoryController");

route.get("/addExtraCategoryPage", addExtraCategoryPage);

route.post("/insertExtraCategory", insertExtraCategory);

route.get("/viewExtraCategoryPage", viewExtraCategoryPage);

route.get('/deleteExtracategory/:id',deleteExtracategory);
route.get('/updateExtracategorypage/:id', updateExtracategory);
route.post('/editExtraCategory/:id', editExtraCategory);

module.exports = route;
