const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
  contactnames: {
    type: [String],
    required: true
  },
  company: {
    type: String,
    required: true
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

module.exports = customer = mongoose.model("customers", CustomerSchema);
