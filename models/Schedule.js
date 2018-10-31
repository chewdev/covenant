const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ScheduleSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "projects",
    required: true
  },
  employees: [
    {
      type: Schema.Types.ObjectId,
      ref: "employees"
    }
  ],
  date: {
    type: Date,
    required: true
  }
});

module.exports = schedule = mongoose.model("schedules", ScheduleSchema);
