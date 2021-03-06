const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProjectSchema = new Schema({
  projectname: {
    type: String
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  projectlocation: {
    type: Schema.Types.ObjectId,
    ref: "projectlocations"
  },
  customerponumber: {
    type: String
  },
  locationponumber: {
    type: String
  },
  covenantponumber: {
    type: String
  },
  currentstatus: {
    type: String,
    default: "Request Received"
  },
  nextsteps: {
    type: [String]
  },
  estimatenumber: {
    type: String
  },
  invoicenumber: {
    type: String
  },
  totalamount: {
    type: Number
  },
  paidamount: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = project = mongoose.model("projects", ProjectSchema);
