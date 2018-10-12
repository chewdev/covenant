const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  phonenumber: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = user = mongoose.model("users", CustomerSchema);
