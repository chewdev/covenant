const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userRoles = require("./../config/config").userRoles;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: userRoles.user
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  isTemporarilyBlocked: {
    type: Boolean,
    default: false
  },
  isBlockedUntil: {
    type: Date
  },
  isPermanentlyBlocked: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = user = mongoose.model("users", UserSchema);
