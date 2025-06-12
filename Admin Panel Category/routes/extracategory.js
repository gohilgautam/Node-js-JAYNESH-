const express = require('express');
const route = express.Router();
const { addextracategorypage, insertcategory, viewextracategorypage, deleteExtracategory, editExtraCategory, updateExtracategorypage } = require('../controller/addextracategory');
const upload = require('../middleware/extracategoryMulter');

route.get('/addextracategorypage', addextracategorypage);
route.post('/insertextracategory', insertcategory);
route.get('/viewextracategorypage', viewextracategorypage);
route.get('/deleteExtracategory/:id', deleteExtracategory);
route.get('/updateExtracategorypage/:id', updateExtracategorypage);
route.post('/editExtraCategory/:id', editExtraCategory);
module.exports = route;