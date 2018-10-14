const express = require("express");
const router = express.Router();
const passport = require("passport");

const ProjectLocation = require("../../models/ProjectLocation");

const validateProjectLocationInput = require("../../validation/projectlocation");

// @route GET api/projectlocations/test
// @desc Tests projectlocations route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some project location" });
});

// @route GET api/projectslocations
// @desc Get projects locations
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectLocation.find()
      .sort({ date: -1 })
      .then(projects => res.json(projects))
      .catch(err =>
        res.status(404).json({ noprojectsfound: "No projects found" })
      );
  }
);

// @route DELETE api/projectlocations/:loc_id
// @desc Delete a project location
// @access Private
router.delete(
  "/:loc_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectLocation.findByIdAndRemove(req.params.loc_id)
      .then(projectlocation => res.json(projectlocation))
      .catch(err =>
        res.status(404).json({
          projectlocationnotfound: "This project location was not found"
        })
      );
  }
);

// @route PUT api/projectlocations/:loc_id
// @desc Delete a project location
// @access Private
router.put(
  "/:loc_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectLocation.findById(req.params.loc_id)
      .then(projectlocation => {
        if (!projectlocation) {
          return res.status(400).json({
            projectlocationnotfound:
              "This project location was not found and cannot be updated"
          });
        } else {
          const { errors, isValid } = validateProjectLocationInput(req.body);

          if (!isValid) {
            return res.status(400).json(errors);
          }

          projectlocation.address = req.body.address;

          if (req.body.locationname) {
            projectlocation.locationname = req.body.locationname;
          }
          if (req.body.phonenumber) {
            projectlocation.phonenumber = req.body.phonenumber;
          }
          if (req.body.contactname) {
            projectlocation.contactname = req.body.contactname;
          }

          projectlocation
            .save()
            .then(projectlocation => {
              res.json(projectlocation);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        res
          .status(404)
          .json({ noprojectsfound: "This project location was not found" });
      });
  }
);

module.exports = router;
