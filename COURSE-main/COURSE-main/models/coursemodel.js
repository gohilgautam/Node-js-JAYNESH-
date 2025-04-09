const mongoose = require('mongoose');
const path = require('path');

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true
    },
    course_price:
    {
        type: Number,
        required: true
    },
    course_duration:{
        type : String,
        required : true, 
    },
    course_duration:{
        type : String,
        required : true, 
    },
    course_cover : {
        type : String,
        required : true ,
    }
});
module.exports = mongoose.model('course', courseSchema);
