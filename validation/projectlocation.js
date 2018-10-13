const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectLocationInput(data) {
  let errors = {};

  data.address = !isEmpty(data.address) ? data.address : "";

  if (!validator.isLength(data.address, { min: 2, max: 150 })) {
    errors.address =
      "Project location address must be between 2 and 150 characters";
  }

  if (validator.isEmpty(data.address)) {
    errors.address = "Project location address is required";
  }

  if (!isEmpty(data.locationname)) {
    if (!validator.isLength(data.locationname, { min: 2, max: 100 })) {
      errors.locationname =
        "Project location name must be between 2 and 100 characters";
    }
  }

  if (!isEmpty(data.contactname)) {
    if (!validator.isLength(data.contactname, { min: 2, max: 50 })) {
      errors.contactname =
        "Project location contact name must be between 2 and 50 characters";
    }
  }

  if (!isEmpty(data.phonenumber)) {
    if (!validator.isLength(data.phonenumber, { min: 10, max: 16 })) {
      errors.phonenumber =
        "Project location phone number must be between 10 and 16 digits long.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
