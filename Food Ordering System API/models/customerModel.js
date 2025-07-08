const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["customer", "admin"], 
        default: "customer" 
    },
    address: {
      type: String,
    },
    phoneNumber: {
         type: Number, 
        },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customer", customerSchema);
