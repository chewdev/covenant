const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectLocationSchema = new Schema({
  locationname: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  contactname: {
    type: String
  },
  phonenumber: {
    type: String
  }
});

module.exports = projectlocation = mongoose.model(
  "projectlocations",
  ProjectLocationSchema
);
