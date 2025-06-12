const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/category/"); // Note: This is 'category', not 'admin'. Ensure it's correct for avatars.
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage }); // Middleware setup
module.exports = upload;