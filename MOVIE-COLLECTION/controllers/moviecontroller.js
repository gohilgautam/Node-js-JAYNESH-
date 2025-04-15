const movie = require('../models/MovieModel');
const multer = require('multer');

const moviePage = async (req , res) =>{
    try{
        const records = await movie.find({});

        console.log(records);

        res.render ('movie', {records})

    }catch(e){
        console.log(e);
        res.render('exception', { e });
    }
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    }
});
