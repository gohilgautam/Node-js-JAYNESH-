const movie = require('../models/MovieModel');
const fs = require('fs');
const path = require('path');

const moviePage = async (req, res) => {
    try {
        const record = await movie.find();

        console.log(record);

        res.render('movie', { record })

    } catch (e) {
        console.log(e);
        res.render('exception', { e });
    }
}

const insertMovie = async (req, res) => {

    const { id, MovieName, Genere, Price, Rating, Description, MovieImage } = req.body
    console.log(req.body);
    const imagePath = req.file ? "uploads/" + req.file.filename: "";

    if(id){
        console.log("updated data...");
        const exiting = await movie.findById(id);

        if (imagePath && existing.image && fs.existsSync(existing.image)) {
            fs.unlinkSync(existing.image);
            await course.findByIdAndUpdate(id, {
                MovieName:MovieName,
                Genere:Genere,
                Price:Price,
                Rating:Rating,
                Description:Description, 
                MovieImage:MovieImage,
            }); 

    }else{
        req.body.MovieImage = imagePath;
        // await movie.create(req.body);
    }}


    // const insert = await movie.create(req.body);

    // if(insert){
    //     console.log('Movie is inserted....', insert);
    // }else{
    //     console.log ('Movie is no instered....', insert);
    // }
    res.redirect('/movie')
}

const deleteMovie = async (req, res) => {
    const id = req.query.id;
    console.log(id);
    if(movie.image && fs.existsSync(movie.image)){
        fs.unlinkSync(movie.image);
    }
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