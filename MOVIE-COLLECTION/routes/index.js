const express = require('express');
const route = express.Router();

const MovieCTR = require('../controllers/moviecontroller');

route.get('/form', (req, res) => {
    res.render('form'); 
});

route.post('/form', MovieCTR.insertMovie);

// Other movie routes
route.get('/', MovieCTR.moviePage);
route.post('/addmovie', MovieCTR.insertMovie);

route.post('/movie',(req, res) => {
    const { MovieName, Genre, Price, Rating, Description } = req.body;
    const MovieImage = req.file;

    console.log('Movie Data:', { MovieName, Genre, Price, Rating, Description });
    console.log('Uploaded Image:', MovieImage);

    // You could store the data in a database here

    res.send('Movie successfully added!');
});

route.get('/deleteMovie', MovieCTR.deleteMovie);
route.get('/updateMovie/:id', MovieCTR.updateMovie);
route.post('/editMovie/:id', MovieCTR.editMovie); 

module.exports = route;