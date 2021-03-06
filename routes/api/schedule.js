const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const fetch = require("node-fetch");
const mapsKey = require("../../config/keys").mapsKey;

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
            const filteredEmployees = employees.filter(employee =>
              req.body.employees.includes(employee._id.toString())
            );
            if (filteredEmployees.length !== req.body.employees.length) {
              return res.status(400).json({
                error:
                  "Some or all employees provided were not found. Please ensure all employees have been added before scheduling work"
              });
            } else {
              const serverDate = new Date();
              const serverOffset = serverDate.getTimezoneOffset();
              const hoursOffset = (req.body.offset - serverOffset) / 60;

              let date = new Date(req.body.date);
              date.setHours(date.getHours() + hoursOffset);
              date = date.toGMTString();
              const newSchedule = new Schedule({
                project: req.body.project,
                employees: req.body.employees,
                date: date,
                notes: req.body.notes,
                isComplete: req.body.isComplete
              });

              newSchedule
                .save()
                .then(schedule => {
                  filteredEmployees.forEach(employee => {
                    if (employee.schedule) {
                      employee.schedule.push(schedule._id);
                    } else {
                      employee.schedule = [schedule._id];
                    }
                    employee
                      .save()
                      .then(employee => null)
                      .catch(err => console.log(err));
                  });
                  return res.json(schedule);
                })
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
      .populate("employees")
      .populate("project")
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

// @route PUT api/schedule/:sched_id/complete
// @desc Update schedule item status to complete
// @access Private route
router.put(
  "/:sched_id/complete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Schedule.findById(req.params.sched_id)
      .populate("employees")
      .populate("project")
      .then(schedule => {
        if (!schedule) {
          return res.status(400).json({
            error:
              "Scheduled appointment not found. Unable to mark as complete."
          });
        } else {
          schedule.isComplete = true;
          schedule
            .save()
            .then(schedule => res.json(schedule))
            .catch(err =>
              res.status(400).json({
                error: "Error updating scheduled appointment to complete."
              })
            );
        }
      })
      .catch(err =>
        res.status(404).json({ error: "Scheduled appointment not found." })
      );
  }
);

// @route PUT api/schedule/:sched_id/checkin
// @desc Update schedule item checkin time
// @access Private route
router.put(
  "/:sched_id/checkin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body.currentlocation) {
      res
        .status(400)
        .json({ checkin: "Please allow location to be provided." });
    } else {
      Schedule.findById(req.params.sched_id)
        .populate("employees")
        .populate("project")
        .populate({
          path: "project",
          populate: { path: "projectlocation" }
        })
        .then(schedule => {
          if (!schedule) {
            return res.status(400).json({
              checkin: "Scheduled appointment not found. Unable to check in."
            });
          } else {
            fetch(
              `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${
                req.body.currentlocation
              }&destinations=${schedule.project.projectlocation.address.replace(
                /\s/g,
                "+"
              )}&key=${mapsKey}`
            )
              .then(response => response.json())
              .then(jsonresponse => {
                if (jsonresponse.rows[0].elements[0].distance.value > 3200) {
                  // 3200 meters, approx 2 miles
                  return res.status(400).json({
                    checkin: "Must be closer to location to check in."
                  });
                } else {
                  schedule.checkin = new Date();
                  schedule
                    .save()
                    .then(schedule => res.json(schedule))
                    .catch(err =>
                      res.status(400).json({
                        checkin: "Error checking in. Try again later."
                      })
                    );
                }
              })
              .catch(err =>
                res
                  .status(400)
                  .json({ checkin: "Error checking in. Try again later." })
              );
          }
        })
        .catch(err => {
          console.log(err);
          return res
            .status(404)
            .json({ checkin: "Scheduled appointment not found." });
        });
    }
  }
);

// @route PUT api/schedule/:sched_id/checkout
// @desc Update schedule item checkout time
// @access Private route
router.put(
  "/:sched_id/checkout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!req.body.currentlocation) {
      res
        .status(400)
        .json({ checkout: "Please allow location to be provided." });
    } else {
      Schedule.findById(req.params.sched_id)
        .populate("employees")
        .populate("project")
        .populate({
          path: "project",
          populate: { path: "projectlocation" }
        })
        .then(schedule => {
          if (!schedule) {
            return res.status(400).json({
              checkout: "Scheduled appointment not found. Unable to check out."
            });
          } else {
            fetch(
              `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${
                req.body.currentlocation
              }&destinations=${schedule.project.projectlocation.address.replace(
                /\s/g,
                "+"
              )}&key=${mapsKey}`
            )
              .then(response => response.json())
              .then(jsonresponse => {
                if (jsonresponse.rows[0].elements[0].distance.value > 8000) {
                  // 8000 meters, approx 5 miles
                  return res.status(400).json({
                    checkout: "Must be closer to location to check out."
                  });
                } else {
                  schedule.checkout = new Date();
                  schedule
                    .save()
                    .then(schedule => res.json(schedule))
                    .catch(err =>
                      res.status(400).json({
                        checkout: "Error checking out. Try again later."
                      })
                    );
                }
              })
              .catch(err =>
                res
                  .status(400)
                  .json({ checkout: "Error checking out. Try again later." })
              );
          }
        })
        .catch(err => {
          console.log(err);
          return res
            .status(404)
            .json({ checkout: "Scheduled appointment not found." });
        });
    }
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
                  const newEmployees = employees.filter(employee =>
                    req.body.employees.includes(employee._id.toString())
                  );
                  const currEmployees = employees.filter(employee => {
                    let isThere = false;
                    schedule.employees.forEach(emplId => {
                      if (emplId.equals(employee._id)) {
                        isThere = true;
                      }
                    });
                    return isThere;
                  });
                  if (newEmployees.length !== req.body.employees.length) {
                    return res.status(400).json({
                      error:
                        "Some or all employees provided were not found. Please ensure all employees have been added before scheduling work"
                    });
                  } else {
                    const addedEmployees = newEmployees.filter(newEmployee => {
                      let isThere = false;
                      currEmployees.forEach(currEmployee => {
                        if (currEmployee.equals(newEmployee)) {
                          isThere = true;
                        }
                      });
                      return !isThere;
                    });

                    const removedEmployees = currEmployees.filter(
                      currEmployee => {
                        let isThere = false;
                        newEmployees.forEach(newEmployee => {
                          if (newEmployee.equals(currEmployee)) {
                            isThere = true;
                          }
                        });
                        return !isThere;
                      }
                    );

                    schedule.project = req.body.project;
                    schedule.employees = req.body.employees;
                    const serverDate = new Date();
                    const serverOffset = serverDate.getTimezoneOffset();
                    const hoursOffset = (req.body.offset - serverOffset) / 60;

                    let date = new Date(req.body.date);
                    date.setHours(date.getHours() + hoursOffset);
                    date = date.toGMTString();

                    schedule.date = date;
                    schedule.isComplete = req.body.isComplete;
                    schedule.notes = req.body.notes;

                    schedule
                      .save()
                      .then(schedule => {
                        addedEmployees.forEach(addEmployee => {
                          if (addEmployee.schedule) {
                            addEmployee.schedule.push(schedule._id);
                          } else {
                            addEmployee.schedule = [schedule._id];
                          }

                          addEmployee
                            .save()
                            .then(() => null)
                            .catch(err => console.log(err));
                        });

                        removedEmployees.forEach(remEmployee => {
                          remEmployee.schedule = remEmployee.schedule.filter(
                            scheduleId => !scheduleId.equals(schedule._id)
                          );
                          remEmployee
                            .save()
                            .then(() => null)
                            .catch(err => console.log(err));
                        });
                        return res.json(schedule);
                      })
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
          if (schedule.employees) {
            schedule.employees.forEach(employee => {
              Employee.findById(employee)
                .then(foundEmployee => {
                  foundEmployee.schedule = foundEmployee.schedule.filter(
                    scheduleItem => {
                      return !scheduleItem.equals(schedule._id);
                    }
                  );
                  foundEmployee
                    .save()
                    .then(() => null)
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            });
          }
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
