const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    phone: String,
    image : String,
    topic: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", authSchema, "Admin");