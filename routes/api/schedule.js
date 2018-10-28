const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Employee input validation
const validateScheduleInput = require("../../validation/schedule");

// Load Employee model
const Employee = require("../../models/Employee");
const Project = require("../../models/Project");
const Schedule = require("../../models/Schedule");

// @route GET api/schedule/test
// @desc Tests schedule route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some schedule" });
});

// @route GET api/schedule
// @desc Get schedule
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Schedule.find()
      .sort({ date: -1 })
      .then(schedule => res.json(schedule))
      .catch(err =>
        res.status(404).json({ noschedulefound: "No schedule found" })
      );
  }
);

// @route POST api/schedule
// @desc Add a schedule item
// @access Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateScheduleInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Project.findById(req.body.project).then(project => {
      if (!project) {
        return res.status(400).json({
          error:
            "Project specified was not found, please add this project before scheduling it."
        });
      } else {
        if (req.body.employees) {
          Employee.find().then(employees => {
            console.log(req.body.employees);
            console.log(employees);
            const filteredEmployees = employees.filter(employee =>
              req.body.employees.includes(employee._id.toString())
            );
            if (filteredEmployees.length !== req.body.employees.length) {
              return res.status(400).json({
                error:
                  "Some or all employees provided were not found. Please ensure all employees have been added before scheduling work"
              });
            } else {
              const newSchedule = new Schedule({
                project: req.body.project,
                employees: req.body.employees,
                date: req.body.date
              });

              newSchedule
                .save()
                .then(schedule => res.json(schedule))
                .catch(err => console.log(err));
            }
          });
        }
      }
    });
  }
);

// @route GET api/schedule/:sched_id
// @desc Get a single scheduled appointment
// @access Private route
router.get(
  "/:sched_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Schedule.findById(req.params.sched_id)
      .then(schedule => {
        if (!schedule) {
          return res
            .status(400)
            .json({ error: "Scheduled appointment not found." });
        } else {
          return res.json(schedule);
        }
      })
      .catch(err =>
        res.status(404).json({ error: "Scheduled appointment not found." })
      );
  }
);

// @route PUT api/schedule/:sched_id
// @desc Update a schedule
// @access Private route
router.put(
  "/:sched_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Schedule.findById(req.params.sched_id)
      .then(schedule => {
        if (!schedule) {
          return res
            .status(400)
            .json({ error: "Schedule not found. Unable to update." });
        } else {
          const { errors, isValid } = validateScheduleInput(req.body);

          // Check Validation
          if (!isValid) {
            return res.status(400).json(errors);
          }

          Project.findById(req.body.project).then(project => {
            if (!project) {
              return res.status(400).json({
                error:
                  "Project specified was not found, please add this project before scheduling it."
              });
            } else {
              if (req.body.employees) {
                Employee.find().then(employees => {
                  const filteredEmployees = employees.filter(employee => {
                    req.body.employees.includes(employee._id);
                  });
                  if (filteredEmployees.length !== req.body.employees.length) {
                    return res.status(400).json({
                      error:
                        "Some or all employees provided were not found. Please ensure all employees have been added before scheduling work"
                    });
                  } else {
                    const newSchedule = new Schedule({
                      project: req.body.project,
                      employees: req.body.employees,
                      date: req.body.date
                    });

                    newSchedule
                      .save()
                      .then(schedule => res.json(schedule))
                      .catch(err => console.log(err));
                  }
                });
              }
            }
          });
        }
      })
      .catch(err =>
        res.status(404).json({ error: "Schedule not found. Could not update." })
      );
  }
);

// @route DELETE api/schedule/:sched_id
// @desc Delete a scheduled appointment
// @access Private
router.delete(
  "/:sched_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Schedule.findByIdAndRemove(req.params.sched_id)
      .then(schedule => {
        if (schedule) {
          res.json(schedule);
        } else {
          res.status(400).json({
            schedulenotfound:
              "Scheduled appointment not found. Unable to remove."
          });
        }
      })
      .catch(err =>
        res
          .status(404)
          .json({ schedulenotfound: "Error finding scheduled appointment." })
      );
  }
);

module.exports = router;
