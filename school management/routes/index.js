const express = require('express');
const route = express.Router();
const SchoolCTR = require('../controllers/SchoolController');
route.get('/', SchoolCTR.schoolPage);
route.get('/school', SchoolCTR.formPage);
route.get('/school/new', (req, res) => {
    res.render('form', { school: {} });
});

route.get('/form', (req, res) => {
    res.render('form', { school: {} });
});

route.post('/form', SchoolCTR.createSchool);

route.get('/school/:id', SchoolCTR.getSchoolById);
route.post('/school', SchoolCTR.createSchool);
route.post('/school/:id', SchoolCTR.updateSchool);
route.post('/school/:id/delete', SchoolCTR.deleteSchool);

module.exports = route;
