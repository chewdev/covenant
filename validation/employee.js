const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCustomerInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.phonenumber = !isEmpty(data.phonenumber) ? data.phonenumber : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  if (!validator.isLength(data.name, { min: 2, max: 100 })) {
    errors.name = "Name must be between 2 and 100 characters";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  if (!validator.isLength(data.phonenumber, { min: 10, max: 16 })) {
    errors.phonenumber = "Phone number must be between 10 and 16 characters";
  }

  if (validator.isEmpty(data.phonenumber)) {
    errors.phonenumber = "Phone number field is required";
  }
  if (!validator.isLength(data.title, { min: 1, max: 100 })) {
    errors.title = "Title must be between 1 and 100 characters";
  }

  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (!isEmpty(data.email)) {
    if (!validator.isEmail(data.email)) {
      errors.email = "Email is invalid";
    }
  }

  if (!isEmpty(data.address)) {
    if (!validator.isLength(data.address, { min: 5, max: 150 })) {
      errors.address = "Address must be between 5 and 150 characters";
    }
  }

  if (!isEmpty(data.phonenumber)) {
    if (!validator.isLength(data.phonenumber, { min: 10, max: 16 })) {
      errors.phonenumber =
        "Phone number must be between 10 and 16 digits long.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
