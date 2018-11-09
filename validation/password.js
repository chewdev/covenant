const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePasswordInput(data) {
  let errors = {};

  data.currentpassword = !isEmpty(data.currentpassword)
    ? data.currentpassword
    : "";
  data.newpassword = !isEmpty(data.newpassword) ? data.newpassword : "";
  data.newpassword2 = !isEmpty(data.newpassword2) ? data.newpassword2 : "";

  if (validator.isEmpty(data.currentpassword)) {
    errors.currentpassword = "Current password field is required";
  }

  if (!validator.isLength(data.currentpassword, { min: 6, max: 30 })) {
    errors.currentpassword = "Current password must be at least 6 characters";
  }

  if (validator.isEmpty(data.newpassword)) {
    errors.newpassword = "New password field is required";
  }

  if (!validator.isLength(data.newpassword, { min: 6, max: 30 })) {
    errors.newpassword = "New password must be at least 6 characters";
  }

  if (validator.isEmpty(data.newpassword2)) {
    errors.newpassword2 = "Confirm new password field is required";
  }

  if (!validator.equals(data.newpassword, data.newpassword2)) {
    errors.newpassword2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
