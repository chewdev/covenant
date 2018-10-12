const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCustomerInput(data) {
  let errors = {};

  data.contactnames = Array.isArray(data.contactnames) ? data.contactnames : [];
  data.contactnames = data.contactnames.filter(
    contactname => !isEmpty(contactname) && typeof contactname === "string"
  );
  data.company = !isEmpty(data.company) ? data.company : "";

  if (data.contactnames.length < 1 || data.contactnames.length > 50) {
    errors.contactnames =
      "There must be at least one contact name and no more than 50 names.";
  }

  data.contactnames.forEach(contactname => {
    if (!validator.isLength(contactname, { min: 2, max: 50 })) {
      errors.contactnames =
        "All contact names must be between 2 and 50 characters.";
    }
  });

  if (!validator.isLength(data.company, { min: 2, max: 100 })) {
    errors.company = "Company name must be between 2 and 100 characters";
  }

  if (validator.isEmpty(data.company)) {
    errors.company =
      "Company field is required. Use customer name if no company is available.";
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
