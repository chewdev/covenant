const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Customer input validation
const validateCustomerInput = require("../../validation/customer");

// Load Customer model
const Customer = require("../../models/Customer");

// @route GET api/customers/test
// @desc Tests customers route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some customer" });
});

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

module.exports = router;
