const mongoose = require('mongoose');


const schoolSchema = mongoose.Schema({
    SchoolName:{
        type:String,
        required:true,
    },
    Location:{
        type:String,
        required:true,
    },
    Course:{
        type:String,
        required:true,
    },
    noStu:{
        type:Number,
        required:true,
    },
    noTeacher:{
        type:Number,
        required:true,
    },
    Image:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
});

const School = mongoose.model('addSchool',schoolSchema);
module.exports = School;
