const movie = require('../models/MovieModel');
const fs = require('fs');
const path = require('path');

const moviePage = async (req, res) => {
    try {
        const record = await movie.find();

        console.log(record);

        res.render('movie', { record})

    } catch (e) {
        console.log(e);
        res.render('exception', { e });
    }
}

const insertMovie = async (req, res) => {
    
    console.log(req.body);

    const insert = await movie.create(req.body);

    if(insert){
        console.log('Movie is inserted....', insert);
    }else{
        console.log ('Movie is no instered....', insert);
    }
    res.redirect('/movie')
}

const deleteMovie = async (req, res) => {
    const id = req.query.id;
    console.log(id);

    await movie.findByIdAndDelete(id);

    res.redirect('/movie');
}

const updateMovie = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    const record = await movie.findById(id);

    await movie.findByIdAndDelete(id);

    res.render('updateMovie', { record });
}

const editMovie = async (req, res) => {
    const id = req.params.id;

    await movie.findByIdAndUpdate(id, req.body);

    res.redirect('/movie');
}

module.exports = {
    moviePage,
    insertMovie,
    deleteMovie,
    updateMovie,
    editMovie,
}