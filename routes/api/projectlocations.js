const express = require("express");
const router = express.Router();
const passport = require("passport");

const ProjectLocation = require("../../models/ProjectLocation");
const Project = require("../../models/Project");

const validateProjectLocationInput = require("../../validation/projectlocation");

// @route GET api/projectlocations/test
// @desc Tests projectlocations route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some project location" });
});

// @route GET api/projectslocations
// @desc Get project locations
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectLocation.find()
      .sort({ date: -1 })
      .then(projectlocations => res.json(projectlocations))
      .catch(err =>
        res
          .status(404)
          .json({ noprojectlocationsfound: "No project locations found" })
      );
  }
);

// @route POST api/projectslocations
// @desc Add project location
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectLocationInput(req.body);
    if (!isValid) {
      res.status(400).json(errors);
    }
    ProjectLocation.find({ address: req.body.address })
      .then(projectlocation => {
        if (projectlocation && projectlocation.length > 0) {
          res.status(400).json({
            errors: {
              address: "This project location has already been added"
            }
          });
        } else {
          const newProjectLocation = new ProjectLocation({
            address: req.body.address,
            locationname: req.body.locationname,
            contactname: req.body.contactname,
            phonenumber: req.body.phonenumber
          });

          newProjectLocation
            .save()
            .then(projectlocation => res.json({ projectlocation }))
            .catch(err =>
              res.status(404).json({
                errors: { projectlocation: "Error adding to database." }
              })
            );
        }
      })
      .catch(err =>
        res
          .status(404)
          .json({ noprojectlocationsfound: "No project locations found" })
      );
  }
);

// @route GET api/projectslocations/:projloc_id/projects
// @desc Get projects by project location
// @access Private
router.get(
  "/:projloc_id/projects",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectLocation.findById(req.params.projloc_id)
      .then(projectlocation => {
        if (!projectlocation) {
          res
            .status(404)
            .json({ projectlocationerror: "Project location not found." });
        } else {
          Project.find({ projectlocation: projectlocation._id })
            .then(projects => res.json(projects))
            .catch(err =>
              res.status(400).json({ projectserror: "Error finding projects" })
            );
        }
      })
      .catch(err =>
        res.status(404).json({ projectserror: "Error finding projects" })
      );
  }
);

// @route GET api/projectslocations
// @desc Get project locations
// @access Private
router.get(
  "/:projloc_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ProjectLocation.findById(req.params.projloc_id)
      .then(projectlocation => res.json(projectlocation))
      .catch(err =>
        res
          .status(404)
          .json({ noprojectlocationsfound: "No project locations found" })
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
      .then(projectlocation => {
        if (projectlocation) {
          Project.deleteMany({ projectlocation: projectlocation._id })
            .then(projects => res.json(projectlocation))
            .catch(err => console.log(err));
        } else {
          return res
            .status(404)
            .json({ projectlocationerror: "Project location not found" });
        }
      })
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

          ProjectLocation.find({ address: req.body.address }).then(
            projectlocations => {
              if (projectlocations && projectlocations.length > 0) {
                const alreadyExists = projectlocations.filter(
                  projectlocation =>
                    projectlocation._id.toString() !== req.body.id
                );
                if (alreadyExists.length > 0) {
                  return res.status(400).json({
                    address:
                      "Unable to change to an address that already exists"
                  });
                }
              }
              projectlocation.address = req.body.address;
              projectlocation.locationname = req.body.locationname;
              projectlocation.phonenumber = req.body.phonenumber;
              projectlocation.contactname = req.body.contactname;

              projectlocation
                .save()
                .then(projectlocation => {
                  res.json(projectlocation);
                })
                .catch(err => console.log(err));
            }
          );
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
