
const express = require('express');
const app = express(); 

const db = require('./config/db');
const route = require('./routes'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.use('/', route);

const port = 8000;
app.listen(port, (err) => {
    if (err) {
        console.log("server is not connected......!!!");
        return;
    } else {
        console.log(`server is connected......!!!, http://localhost:${port}`);
    }
});
