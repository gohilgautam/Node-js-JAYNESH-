const express = require("express");
const db = require('./config/db');
const course = require('./models/coursemodel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
app.get("/", async (req, res) => {
    const records = await course.find();
    res.render("index", { records });
});

app.get("/form", (req, res) => {
    res.render("form");
});

app.get("/update", async (req, res) => {
    const id = req.query.id;
    const record = await course.findById(id);
    res.render("edit", { record });
});

app.post("/insert", upload.single("course_cover"), async (req, res) => {
    const { id, course_name, course_price, course_duration, course_category, course_cover } = req.body;
   const imagePath = req.file ? "uploads/" + req.file.filename : "";

    if (id) {
        console.log("updated data........");
        const existing = await course.findById(id);

        if (imagePath && existing.image && fs.existsSync(existing.image)) {
            fs.unlinkSync(existing.image);
            await course.findByIdAndUpdate(id, {
                name: course_name,
                price: course_price,
                duration: course_duration,
                category: course_category,
                image: course_cover || existing.image
            });
        }
        
    } else {
        req.body.course_cover = imagePath;
        await course.create(req.body);
    }
    res.redirect("/");
});




app.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const courseData = await course.findById(id);
    if (courseData.image && fs.existsSync(courseData.image)) {
        fs.unlinkSync(courseData.image);
    }
    await course.findByIdAndDelete(id);
    res.redirect("/");
});

// Server Start
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
