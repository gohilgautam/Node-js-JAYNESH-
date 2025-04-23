const express = require('express');
const route = express.Router;

const SchoolCTR = require('../controllers/SchoolController');

route.use('/', SchoolCTR.schoolPage);

module.expotrs = route;

