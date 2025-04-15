const express = require('express');

const route = express.Router();

const MovieCTR = require('../controllers/moviecontroller');

route.get('/', MovieCTR.moviePage);

route.post('/form', MovieCTR.insertMovie);

route.get('/delMovie', MovieCTR.deleteMovie);

route.get('/upMovie/:id', MovieCTR.updateMovie);

route.post('/editMopvie/:id', MovieCTR.editMovie);

module.exports = route;