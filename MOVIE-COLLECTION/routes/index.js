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
route.get('/movie', MovieCTR.moviePage);
route.post('/movie', upload.single('MovieImage'), MovieCTR.insertMovie);
route.post('/addmovie', MovieCTR.insertMovie);
route.get('/updateMovie/:id', MovieCTR.updateMovie);

route.post('/updateMovie/:id', upload.single('MovieImage'), MovieCTR.editMovie);
route.get('/deleteMovie/:id', MovieCTR.deleteMovie);

module.exports = route;