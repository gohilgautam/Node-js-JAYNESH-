const multer = require('multer');
//multer middelware for admin image===================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/admin');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage });

module.exports = upload;