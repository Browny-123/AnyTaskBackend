const express = require("express");
const router = new express.Router();
const userModel = require("./../models/UserModel");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.post("/signup", (req, res, next) => {
  const {
    username,
    name,
    contactNumber,
    email,
    password,
    street,
    city,
    county,
    postcode,
    country
  } = req.body;

  var errorMessage = "";

  if (!username || !email || !password) {
    errorMessage = "Please provide a username, email and password";
  }
  if (errorMessage) return res.status(403).json(errorMessage);

  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);

  const newUser = {
    username,
    name,
    contactNumber,
    email,
    password: hashed,
    address: {
      street: street,
      city: city,
      county: county,
      postcode: postcode,
      country: country
    }
  };

  userModel
    .create(newUser)
    .then(userDb => {
      req.login(userDb, err => {
        if (err) res.status(500).json("Error, please sign up again");
        res.status(200).json(req.user);
      });
    })
    .catch(err => {
      res.status(409).json(err);
    });
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, failureDetails) => {
    if (err || !user) return res.status(403).json("Invalid User");

    req.logIn(user, function(err) {
      if (err) {
        res.json({ message: "Something went wrong logging in" });
      }

      const { _id, username, name, contactNumber, email, address } = user;
      next(
        res.status(200).json({
          currentUser: {
            _id,
            username,
            name,
            contactNumber,
            email,
            address
          }
        })
      );
    });
  })(req, res, next);
});

module.exports = router;
