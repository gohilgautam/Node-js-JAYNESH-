const mongoose = require("mongoose");

const subcategorySchema = mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subcategory_title: {
        type: String,
        required: true,
    },
});

const subCategoryModel = mongoose.model("SubCategory", subcategorySchema, "SubCategory");

module.exports = subCategoryModel;