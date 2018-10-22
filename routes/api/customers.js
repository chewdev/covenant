const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Customer input validation
const validateCustomerInput = require("../../validation/customer");

// Load Customer model
const Customer = require("../../models/Customer");
const Project = require("../../models/Project");

// @route GET api/customers/test
// @desc Tests customers route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some customer" });
});

// @route GET api/customers
// @desc Get customers
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Customer.find()
      .sort({ date: -1 })
      .then(customers => res.json(customers))
      .catch(err =>
        res.status(404).json({ nocustomersfound: "No customers found" })
      );
  }
);

// @route POST api/customers/
// @desc Add a customer
// @access Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCustomerInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Customer.findOne({ company: req.body.company }).then(customer => {
      if (customer) {
        return res
          .status(400)
          .json({ error: "That company or name has already been added." });
      } else {
        const newCustomer = new Customer({
          company: req.body.company,
          contactnames: req.body.contactnames,
          email: req.body.email,
          address: req.body.address,
          phonenumber: req.body.phonenumber
        });
        newCustomer
          .save()
          .then(customer => res.json(customer))
          .catch(err => console.log(err));
      }
    });
  }
);

// @route GET api/customers/:cust_id
// @desc Get a single customer
// @access Private route
router.get(
  "/:cust_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Customer.findById(req.params.cust_id)
      .then(customer => {
        if (!customer) {
          return res.status(400).json({ error: "Customer not found." });
        } else {
          return res.json(customer);
        }
      })
      .catch(err => res.status(404).json({ error: "Customer not found." }));
  }
);

// @route PUT api/customers/:cust_id
// @desc Update a customer
// @access Private route
router.put(
  "/:cust_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Customer.findById(req.params.cust_id)
      .then(customer => {
        if (!customer) {
          return res
            .status(400)
            .json({ error: "Customer not found. Unable to update." });
        } else {
          const { errors, isValid } = validateCustomerInput(req.body);

          // Check Validation
          if (!isValid) {
            return res.status(400).json(errors);
          }

          customer.company = req.body.company;
          customer.contactnames = req.body.contactnames;
          customer.email = req.body.email;
          customer.address = req.body.address;
          customer.phonenumber = req.body.phonenumber;

          customer
            .save()
            .then(customer => res.json(customer))
            .catch(err => console.log(err));
        }
      })
      .catch(err =>
        res.status(404).json({ error: "Customer not found. Could not update." })
      );
  }
);

// @route DELETE api/customers/:cust_id
// @desc Delete a customer
// @access Private
router.delete(
  "/:cust_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Customer.findByIdAndRemove(req.params.cust_id)
      .then(customer => {
        if (customer) {
          Project.deleteMany({ customer: customer._id }).then(projects => {
            if (projects) {
              res.json([projects, customer]);
            } else {
              res.json(customer);
            }
          });
        } else {
          res.status(400).json({
            customernotfound: "Customer not found. Unable to remove."
          });
        }
      })
      .catch(err =>
        res.status(404).json({ cutsomernotfound: "Error finding customer." })
      );
  }
);

module.exports = router;
