const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.customer = !isEmpty(data.customer) ? data.customer : "";

  if (!validator.isLength(data.customer, { min: 2, max: 100 })) {
    errors.customer = "Customer name must be between 2 and 100 characters";
  }

  if (validator.isEmpty(data.customer)) {
    errors.customer =
      "Customer field is required. Use customer name if no company is available.";
  }

  if (data.projectlocation && data.projectlocation.address) {
    if (
      !validator.isLength(data.projectlocation.address, { min: 2, max: 150 })
    ) {
      errors.projectlocation =
        "Project location address must be between 2 and 150 characters.";
    }

    if (validator.isEmpty(data.projectlocation.address)) {
      errors.projectlocation = "Project location address is required";
    }
  } else {
    if (!data.projectlocation) {
      errors.projectlocation = "Project location information must be included";
    } else {
      if (!data.projectlocation.address) {
        errors.projectlocation = "Project location address is required";
      }
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
