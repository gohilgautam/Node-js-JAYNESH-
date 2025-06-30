const express = require('express');

const app = express();

const PORT = 5656;

app.listen(PORT, (err) => {
    if (err) {
        return console.error('Error starting server:', err);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
}
);
