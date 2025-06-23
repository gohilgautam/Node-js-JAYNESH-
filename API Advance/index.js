const express = require('express');


const app = express();
const port = 3000;

app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if (err) {
        return console.error('Error starting server:', err);
    }
  console.log(`Server is running on http://localhost:${port}`);
}
);
