const express = require('express');

const route = express.Router();

route.use('/admin', require('./adminRoutes'));
route.use('/employee', require('./employeeRoute'));
route.use('/manager', require('./managerRoute'));

module.exports = route;
