const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    MovieName: {
        type: String,
        required: true,
    },
    Genere: {
        type: String,
        require: true,
    },
    Price:{
        type: Number,
        require: true,
    },
    Rating: {
        type: String,
        require: true,
    },
    Description:{
        type: String,
        require: true,
    },
    MovieImage:{
        type: String,
        require: true,
    },
});

const movie = mongoose.model('movieAdd',movieSchema);

module.exports = movie;
