const mongoose = require('mongoose');

// MongoDB Schema
const studentSchema = mongoose.Schema({
    Course_Title: {
        type: String,
        required: true,
    },
    Course_Price: {
        type: Number,
        required: true,
    },
    Course_Duration: {
        type: String,
        required: true,
    },
    Course_Category:{
        type:String,
        requored:true,
    },
    image: {
        type: String,
        required: true,
    }
})

// MongoDB Model
const course = mongoose.model('students', studentSchema);

module.exports = course;