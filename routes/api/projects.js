const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Input Validation
const validateProjectInput = require("../../validation/project");
const validateProjectLocationInput = require("../../validation/projectlocation");

// Load models
const Project = require("../../models/Project");
const Customer = require("../../models/Customer");
const ProjectLocation = require("../../models/ProjectLocation");

// @route GET api/projects/test
// @desc Tests projects route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some project" });
});

// @route GET api/projects
// @desc Get projects
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.find()
      .sort({ date: -1 })
      .then(projects => res.json(projects))
      .catch(err =>
        res.status(404).json({ noprojectsfound: "No projects found" })
      );
  }
);

// @route POST api/projects/
// @desc Add project
// @access Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Customer.findOne({ company: req.body.customer }).then(customer => {
      if (!customer) {
        return res.status(400).json({
          error:
            "This customer does not exist. Please add this customer before creating a new project for this customer."
        });
      } else {
        ProjectLocation.findOne({
          address: req.body.projectlocation.address
        }).then(projectlocation => {
          if (!projectlocation) {
            const projectLocData = req.body.projectlocation;
            const { errors, isValid } = validateProjectLocationInput(
              projectLocData
            );

            if (!isValid) {
              return res.status(400).json(errors);
            }

            const newProjectLocation = new ProjectLocation({
              address: req.body.projectlocation.address
            });

            if (projectLocData.locationname) {
              newProjectLocation.locationname = projectLocData.locationname;
            }
            if (projectLocData.phonenumber) {
              newProjectLocation.phonenumber = projectLocData.phonenumber;
            }
            if (projectLocData.contactname) {
              newProjectLocation.contactname = projectLocData.contactname;
            }

            newProjectLocation
              .save()
              .then(projectlocation => {
                createNewProject(projectlocation);
              })
              .catch(err => console.log(err));
          } else {
            createNewProject(projectlocation);
          }
        });

        function createNewProject(projectlocation) {
          const newProject = new Project({
            customer: customer._id,
            projectlocation: projectlocation._id
          });

          if (req.body.customerponumber) {
            newProject.customerponumber = req.body.customerponumber;
          }
          if (req.body.locationponumber) {
            newProject.locationponumber = req.body.locationponumber;
          }
          if (req.body.covenantponumber) {
            newProject.covenantponumber = req.body.covenantponumber;
          }
          if (req.body.currentstatus) {
            newProject.currentstatus = req.body.currentstatus;
          }
          if (req.body.nextsteps) {
            newProject.nextsteps = req.body.nextsteps;
          }
          if (req.body.estimatenumber) {
            newProject.estimatenumber = req.body.estimatenumber;
          }
          if (req.body.invoicenumber) {
            newProject.invoicenumber = req.body.invoicenumber;
          }
          if (req.body.totalamount) {
            newProject.totalamount = req.body.totalamount;
          }
          if (req.body.paidamount) {
            newProject.paidamount = req.body.paidamount;
          }

          newProject
            .save()
            .then(project => res.json(project))
            .catch(err => console.log(err));
        }
      }
    });
  }
);

// @route PUT api/projects/:proj_id
// @desc Update project
// @access Private route
router.put(
  "/:proj_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProjectInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Project.findById(req.params.proj_id).then(project => {
      if (!project) {
        return res.status(400).json({
          error: "This project does not exist and cannot be updated."
        });
      } else {
        Customer.findOne({ company: req.body.customer }).then(customer => {
          if (!customer) {
            return res.status(400).json({
              error:
                "This customer does not exist. Please add this customer before creating or updating a project for this customer."
            });
          } else {
            ProjectLocation.findOne({
              address: req.body.projectlocation.address
            }).then(projectlocation => {
              if (!projectlocation) {
                const projectLocData = req.body.projectlocation;
                const { errors, isValid } = validateProjectLocationInput(
                  projectLocData
                );

                if (!isValid) {
                  return res.status(400).json(errors);
                }

                const newProjectLocation = new ProjectLocation({
                  address: req.body.projectlocation.address
                });

                if (projectLocData.locationname) {
                  newProjectLocation.locationname = projectLocData.locationname;
                }
                if (projectLocData.phonenumber) {
                  newProjectLocation.phonenumber = projectLocData.phonenumber;
                }
                if (projectLocData.contactname) {
                  newProjectLocation.contactname = projectLocData.contactname;
                }

                newProjectLocation
                  .save()
                  .then(projectlocation => {
                    updateProject(projectlocation, project);
                    // return res.json(project || { error: "no project" });
                  })
                  .catch(err => console.log(err));
              } else {
                // return res.json(project || { error: "no project" });
                updateProject(projectlocation, project);
              }
            });

            function updateProject(projectlocation, project) {
              project.customer = customer._id;
              project.projectlocation = projectlocation._id;

              if (req.body.customerponumber) {
                project.customerponumber = req.body.customerponumber;
              }
              if (req.body.locationponumber) {
                project.locationponumber = req.body.locationponumber;
              }
              if (req.body.covenantponumber) {
                project.covenantponumber = req.body.covenantponumber;
              }
              if (req.body.currentstatus) {
                project.currentstatus = req.body.currentstatus;
              }
              if (req.body.nextsteps) {
                project.nextsteps = req.body.nextsteps;
              }
              if (req.body.estimatenumber) {
                project.estimatenumber = req.body.estimatenumber;
              }
              if (req.body.invoicenumber) {
                project.invoicenumber = req.body.invoicenumber;
              }
              if (req.body.totalamount) {
                project.totalamount = req.body.totalamount;
              }
              if (req.body.paidamount) {
                project.paidamount = req.body.paidamount;
              }

              project
                .save()
                .then(project => res.json(project))
                .catch(err => console.log(err));
            }
          }
        });
      }
    });
  }
);

// @route DELETE api/projects/:proj_id
// @desc Delete a project
// @access Private
router.delete(
  "/:proj_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findByIdAndRemove(req.params.proj_id)
      .then(project => {
        if (project) {
          res.json(project);
        } else {
          res
            .status(400)
            .json({ projectnotfound: "Project not found. Unable to remove." });
        }
      })
      .catch(err =>
        res.status(404).json({ projectnotfound: "Error finding project." })
      );
  }
);

module.exports = router;
