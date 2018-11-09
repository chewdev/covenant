const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const allowOnly = require("./../../services/routesHelper").allowOnly;
const accessLevels = require("./../../config/config").accessLevels;

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validatePasswordInput = require("../../validation/password");

// Load User model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Tests users route
// @access Public route
router.get("/test", (req, res) => {
  res.json({ msg: "some user" });
});

// @route POST api/users/register
// @desc Register user
// @access Public route
router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  allowOnly(accessLevels.admin, (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ error: "register error" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        if (req.body.role) {
          newUser.role = req.body.role;
        }

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  })
);

// @route POST api/users/login
// @desc Login User / Return JWT Token
// @access Public route
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    //Check if user exists
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        // Create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 7200 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route PUT api/users/password
// @desc Login User / Return JWT Token
// @access Public route
router.put(
  "/password",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePasswordInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const { user } = req;
    const currentpassword = req.body.currentpassword;

    bcrypt.compare(currentpassword, user.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.newpassword, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            user.password = hash;
            user
              .save()
              .then(user => {
                const payload = {
                  id: user.id,
                  name: user.name,
                  role: user.role,
                  email: user.email
                };
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 7200 },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  }
                );
              })
              .catch(err => console.log(err));
          });
        });
      } else {
        errors.currentpassword = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  }
);

// @route GET api/users/current
// @desc Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
