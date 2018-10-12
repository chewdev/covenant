const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load Customer input validation
const validateCustomerInput = require("../../validation/customer");

// Load Customer model
const Customer = require("../../models/Customer");

// @route GET api/users/test
// @desc Tests users route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some customer" });
});

// @route GET api/users/register
// @desc Register user
// @access Public route
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

module.exports = router;
