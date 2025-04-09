// const express = require('express');
// const multer = require('multer');
// const route = express.Router();
// const controllers = require('../controllers/coursecontroller');

// const storage = multer.diskStorage({
//     destination : (req, file,cb) => {
//         cb(null, "uploads/");
//     },
//     filename : (req, file, cb) => {
//         cb(null, Date.now()+file.originalname)
//     }
// });
 
// const upload = multer({storage: storage});

// console.log("Routing...");

// route.get('/', controllers.homepage);
// route.get('/form', controllers.RenderForm);
// route.post('/insert', upload.single('course_cover'), controllers.insertcover);
// route.get('/delete/:id', controllers.Deletecourse)
// route.post('/edit/:id',upload.single('couurse_cover'), controllers.Editcover);
// route.get('/update/:id', controllers.Updatecourse)

// module.exports = route;
