const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    category_title :{
        type : String,
        required : true
    },
    category_image : {
        type : String,
        required : true
    }
})

const category = mongoose.model('Category', categorySchema, "Category");

module.exports = category;