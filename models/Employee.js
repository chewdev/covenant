const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  schedule: {
    type: [Schema.Types.ObjectId],
    ref: "schedules"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = employee = mongoose.model("employees", EmployeeSchema);
