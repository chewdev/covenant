const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Employee input validation
const validateEmployeeInput = require("../../validation/employee");

// Load Employee model
const Employee = require("../../models/Employee");

// @route GET api/employees/test
// @desc Tests employees route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some employee" });
});

// @route GET api/employees
// @desc Get employees
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Employee.find()
      .sort({ date: -1 })
      .then(employees => res.json(employees))
      .catch(err =>
        res.status(404).json({ noemployeesfound: "No employees found" })
      );
  }
);

// @route POST api/employees/
// @desc Add an employee
// @access Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEmployeeInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Employee.findOne({ name: req.body.name }).then(employee => {
      if (employee) {
        return res.status(400).json({
          error:
            "An employee with that name has already been added. Names must be unique and not duplicated."
        });
      } else {
        const newEmployee = new Employee({
          name: req.body.name,
          phonenumber: req.body.phonenumber,
          email: req.body.email,
          address: req.body.address,
          title: req.body.title
        });
        newEmployee
          .save()
          .then(employee => res.json(employee))
          .catch(err => console.log(err));
      }
    });
  }
);

// @route GET api/employees/:empl_id
// @desc Get a single employee
// @access Private route
router.get(
  "/:empl_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Employee.findById(req.params.empl_id)
      .then(employee => {
        if (!employee) {
          return res.status(400).json({ error: "Employee not found." });
        } else {
          return res.json(employee);
        }
      })
      .catch(err => res.status(404).json({ error: "Employee not found." }));
  }
);

// @route PUT api/employees/:empl_id
// @desc Update an employee
// @access Private route
router.put(
  "/:empl_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Employee.findById(req.params.empl_id)
      .then(employee => {
        if (!employee) {
          return res
            .status(400)
            .json({ error: "Employee not found. Unable to update." });
        } else {
          const { errors, isValid } = validateEmployeeInput(req.body);

          // Check Validation
          if (!isValid) {
            return res.status(400).json(errors);
          }

          employee.name = req.body.name;
          employee.phonenumber = req.body.phonenumber;
          employee.title = req.body.title;
          employee.email = req.body.email;
          employee.address = req.body.address;

          employee
            .save()
            .then(employee => res.json(employee))
            .catch(err => console.log(err));
        }
      })
      .catch(err =>
        res.status(404).json({ error: "Employee not found. Could not update." })
      );
  }
);

// @route DELETE api/employees/:empl_id
// @desc Delete an employee
// @access Private
router.delete(
  "/:empl_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Employee.findByIdAndRemove(req.params.empl_id)
      .then(employee => {
        if (employee) {
          res.json(employee);
        } else {
          res.status(400).json({
            employeenotfound: "Employee not found. Unable to remove."
          });
        }
      })
      .catch(err =>
        res.status(404).json({ employeenotfound: "Error finding employee." })
      );
  }
);

module.exports = router;
