const mongoose = require("mongoose");

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("DB is connected...🎄🎄");
  })
  .catch((err) => {
    console.log("Error : ", err);
  });
