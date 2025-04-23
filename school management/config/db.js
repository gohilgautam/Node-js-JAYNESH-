const mongoose = require('mongoose');

const URI = "mongodb://localhost:27017/School-Management"

mongoose.connect(URI);

const db = mongoose.connection

db.on('connected', () => {
    console.log("Datase is connected..");
});
db.on('error', (err) => {
    console.log("database is connected...", err);
});
db.on('disconnected', () => {
    console.log("Database is Disconnected...")
});

module.expots = db;