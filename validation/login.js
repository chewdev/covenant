const validator = require("validator");
const isEmpty = require("./is-empty");
const stringForValid = require("./string-for-valid");

module.exports = function validateLoginInput(data) {
  let errors = {};

  let { email, password } = data;

  email = stringForValid(email);
  password = stringForValid(password);

  if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email field is required";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
