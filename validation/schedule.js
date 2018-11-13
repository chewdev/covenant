const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateScheduleInput(data) {
  let errors = {};

  data.employees = Array.isArray(data.employees) ? data.employees : [];
  data.employees = data.employees.filter(
    employee => !isEmpty(employee) && typeof employee === "string"
  );
  data.project = !isEmpty(data.project) ? data.project : "";
  data.notes = !isEmpty(data.notes) ? data.notes : "";

  const invalidEmployees = data.employees.some(
    employee => !validator.isLength(employee, { min: 2, max: 50 })
  );
  if (invalidEmployees) {
    errors.employees = "All employee id's must be between 2 and 50 characters.";
  }

  if (!validator.isLength(data.project, { min: 2, max: 50 })) {
    errors.project = "Project id must be between 2 and 50 characters";
  }

  if (validator.isEmpty(data.project)) {
    errors.project = "Project field is required for scheduling";
  }

  if (!data.date) {
    errors.date = "Date field is required for scheduling";
  } else {
    const date = new Date(data.date);
    if (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    ) {
      // proper date
    } else {
      errors.date = "Date field must be a valid date";
    }
  }

  if (!data.offset) {
    errors.offset = "Timezome offset is required.";
  } else {
    if (typeof data.offset !== "number") {
      errors.offset = "Timezone offset must be a number";
    } else if (data.offset < -840 || data.offset > 720) {
      errors.offset = "Invalid timezone offset provided";
    }
  }

  if (!validator.isBoolean(data.isComplete)) {
    errors.isComplete = "Must be true or false.";
  }

  if (data.notes && !validator.isLength(data.notes, { min: 1, max: 500 })) {
    errors.notes = "Notes must be between 1 and 500 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
