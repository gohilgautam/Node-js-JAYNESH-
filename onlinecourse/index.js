const express = require('express');
const db = require('./config/database');
const student = require('./models/course');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }); // File Middleware

app.get('/', (req, res) => {
    res.render('form');
})

// Insert
app.post('/course', upload.single('image'), async (req, res) => {

    const { id, Cname, Cprice, Cduration, Ccategory } = req.body;

    console.log(req.file);

    let image = "";

    if (req.file) {
        image = req.file.path;
    }

    if (id) {
        // Edit

        const data = await student.findById(id);

        if (image) {
            console.log("New Image");

            fs.unlinkSync(data.image)

            student.findByIdAndUpdate(id, {
                Cname: Cname,
                Cprice: Cprice,
                Cduratiobn: Cduration,
                Ccategory: Ccategory,
                image: image,
            }).then(() => {
                console.log("Data is Updated");
                res.redirect('/fetch');
            }).catch((err) => {
                console.log(err);
            });

        } else {
            console.log("Old Image");

            student.findByIdAndUpdate(id, {
                Cname: Cname,
                Cprice: Cprice,
                Cduratiobn: Cduration,
                Ccategory: Ccategory,
                image: data.image,
            }).then(() => {
                console.log("Data is Updated");
                res.redirect('/fetch');
            }).catch((err) => {
                console.log(err);
            });
        }

    } else {
        // Insert
        student.create({
            Cname: Cname,
            Cprice: Cprice,
            Cduratiobn: Cduration,
            Ccategory: Ccategory,
            image: image,
        }).then(() => {
            console.log("Data inserted...");
            res.redirect('/');
        }).catch((err) => {
            console.log("Error ", err);
        })
    }
    // res.redirect('/fetch');
})

// Fetch
app.get('/fetch', (req, res) => {

    student.find({}).then((records) => {
        // console.log(records);
        res.render('table', { records });


    }).catch((err) => {
        console.log("Error", err);
        res.send(err);
    });
})

// Delete
app.get('/deleteStud/:id', async (req, res) => {
    // const id = req.query.id;
    const id = req.params.id;
    console.log("Delete ID", id);

    const data = await student.findById(id);

    console.log(data);

    fs.unlinkSync(data.image);

    student.findByIdAndDelete(id).then(() => {
        console.log("Deleted Succussfully..");
    }).catch((err) => {
        console.log("Error", err);
    });

    res.redirect('/fetch');
})

// Edit Route
app.get("/editStud", (req, res) => {
    const id = req.query.id;

    console.log("Update ID", id);


    student.findById(id).then((record) => {
        console.log(record);
        res.render('edit', { record });
    }).catch((err) => {
        res.redirect('/fetch');
        console.log(err);
    })
})


app.listen(port, () => console.log('Server started...'));