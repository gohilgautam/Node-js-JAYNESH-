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
    try {
        console.log(req.body);
        let movieData = {
            MovieName: req.body.MovieName,
            Genere: req.body.Genere,
            Price: req.body.Price,
            Rating: req.body.Rating,
            Description: req.body.Description,
        };

        if (req.file) {
            movieData.MovieImage = req.file.path;
        }

        const insert = await movie.create(movieData);

        if (insert) {
            console.log(insert);
        } else {
            console.log(insert);
        }

        res.redirect('/movie');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


const deleteMovie = async (req, res) => {
    const id = req.params.id;
    try {
        const record = await movie.findById(id);
        if (!record) {
        }
        if (record.MovieImage && fs.existsSync(record.MovieImage)) {
            fs.unlinkSync(record.MovieImage);
        }
        await movie.findByIdAndDelete(id);
        res.redirect('/movie');
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
};

const updateMovie = async (req, res) => {
    const id = req.params.id;
    try {
        const record = await movie.findById(id);
        if (!record) {
        }
        res.render('updateMovie', { record });
    } catch (error) {
        console.error('Error fetching movie:', error);
    }
};

const editMovie = async (req, res) => {
    const id = req.params.id;
    try {
        const EditMovie = await movie.findById(id);
        if (!EditMovie) {
        }
        if (req.body.deleteImage === 'yes') {
            if (EditMovie.MovieImage && fs.existsSync(EditMovie.MovieImage)) {
                fs.unlinkSync(EditMovie.MovieImage);
                console.log('Old image deleted due to checkbox');
            }
            req.body.MovieImage = null;
        } else if (req.file) {
            if (EditMovie.MovieImage && fs.existsSync(EditMovie.MovieImage)) {
                fs.unlinkSync(EditMovie.MovieImage);
                console.log('Old image deleted due to new upload');
            }
            req.body.MovieImage = req.file.path;
        } else {
            req.body.MovieImage = EditMovie.MovieImage;
        }

        const updateData = {
            MovieName: req.body.MovieName,
            Genere: req.body.Genere,
            Price: req.body.Price,
            Rating: req.body.Rating,
            Description: req.body.Description,
            MovieImage: req.body.MovieImage,
        };

        const updated = await movie.findByIdAndUpdate(id, updateData, { new: true });
        if (updated) {
            console.log('Movie updated:', updated);
        }
        res.redirect('/movie');
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).send('Server Error');
    }
};
module.exports = {
    moviePage,
    insertMovie,
    deleteMovie,
    updateMovie,
    editMovie,
}
