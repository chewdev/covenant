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
  },
  notes: {
    type: String
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  checkin: {
    type: Date
  },
  checkout: {
    type: Date
  }
});

module.exports = schedule = mongoose.model("schedules", ScheduleSchema);
