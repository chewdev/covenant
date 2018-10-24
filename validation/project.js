const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.customer = !isEmpty(data.customer) ? data.customer : "";
  data.projectname = !isEmpty(data.projectname) ? data.projectname : "";

  if (!validator.isLength(data.projectname, { min: 1, max: 200 })) {
    errors.projectname = "Project name must be between 1 and 200 characters";
  }

  if (validator.isEmpty(data.projectname)) {
    errors.projectname = "Project name is required.";
  }

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
      errors.address =
        "Project location address must be between 2 and 150 characters.";
    }

    if (validator.isEmpty(data.projectlocation.address)) {
      errors.address = "Project location address is required";
    }
  } else {
    if (!data.projectlocation || !data.projectlocation.address) {
      errors.address = "Project location address is required";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
