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

  if (
    data.customerponumber &&
    !validator.isLength(data.customerponumber, { min: 1, max: 25 })
  ) {
    errors.customerponumber =
      "Customer PO# must be between 1 and 25 characters long.";
  }
  if (
    data.locationponumber &&
    !validator.isLength(data.locationponumber, { min: 1, max: 25 })
  ) {
    errors.locationponumber =
      "Location PO# must be between 1 and 25 characters long.";
  }
  if (
    data.covenantponumber &&
    !validator.isLength(data.covenantponumber, { min: 1, max: 25 })
  ) {
    errors.covenantponumber =
      "Covenant PO# must be between 1 and 25 characters long.";
  }
  if (
    data.currentstatus &&
    !validator.isLength(data.currentstatus, { min: 1, max: 100 })
  ) {
    errors.currentstatus =
      "Current status must be between 1 and 100 characters long.";
  }
  if (
    data.estimatenumber &&
    !validator.isLength(data.estimatenumber, { min: 1, max: 25 })
  ) {
    errors.estimatenumber =
      "Estimate # must be between 1 and 25 characters long.";
  }
  if (
    data.invoicenumber &&
    !validator.isLength(data.invoicenumber, { min: 1, max: 25 })
  ) {
    errors.invoicenumber =
      "Invoice # must be between 1 and 25 characters long.";
  }

  if (data.totalamount) {
    if (!/^\d*([,]\d{3})?([.]\d\d?)?$/gm.test(data.totalamount)) {
      errors.totalamount = "Total amount must be a properly formatted price.";
    } else if (data.totalamount.split(".")[0].match(/[0-9]/g).length > 9) {
      errors.totalamount =
        "Total amount must be less than or equal to $999,999,999.99";
    }
  }
  if (data.paidamount) {
    if (!/^\d*([,]\d{3})?([.]\d\d?)?$/gm.test(data.paidamount)) {
      errors.paidamount = "Paid amount must be a properly formatted price.";
    } else if (data.paidamount.split(".")[0].match(/[0-9]/g).length > 9) {
      errors.paidamount =
        "Paid amount must be less than or equal to $999,999,999.99";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
