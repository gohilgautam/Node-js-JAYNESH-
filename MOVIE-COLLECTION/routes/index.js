const express = require('express');
const route = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const MovieCTR = require('../controllers/moviecontroller');

route.get('/form', (req, res) => {
    res.render('form'); 
});

route.post('/form', upload.single('MovieImage'), MovieCTR.insertMovie);

// Other movie routes
route.get('/', MovieCTR.moviePage);
route.post('/addmovie', MovieCTR.insertMovie);

route.post('/movie',(req, res) => {
    const { MovieName, Genre, Price, Rating, Description } = req.body;
    const MovieImage = req.file;

    console.log('Movie Data:', { MovieName, Genre, Price, Rating, Description });
    console.log('Uploaded Image:', MovieImage);
    res.send('Movie successfully added!');
});

route.get('/deleteMovie/:id', MovieCTR.deleteMovie);
route.get('/updateMovie/:id', MovieCTR.updateMovie);
route.post('/editMovie/:id', MovieCTR.editMovie); 

module.exports = route;