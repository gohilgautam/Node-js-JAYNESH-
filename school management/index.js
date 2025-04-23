const express = require('express');
const db = require('./config/db');
const route = require('./routes')
const schoolPage  = require('./controllers/SchoolController');

const app = express ();

const port = 8000;

app.set('view engine', 'ejs');

app.use('/', schoolPage);

app.listen(port, (err) => {
    if(err){
        console.log("server is not connected......!!!")
        return false;
    }else{
        console.log("server is connected......!!!, http://localhost:${port}");
    }
});
