const express = require("express");
const router = new express.Router();
const userModel = require("./../models/UserModel");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const uploader = require("./../config/cloudinary");

router.post("/signup", uploader.single("profilePicture"), (req, res, next) => {
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

  if (req.file) newUser.profilePicture = req.file.secure_url;

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

      const {
        _id,
        username,
        name,
        contactNumber,
        email,
        address,
        profilePicture
      } = user;
      next(
        res.status(200).json({
          currentUser: {
            _id,
            username,
            name,
            contactNumber,
            email,
            address,
            profilePicture
          }
        })
      );
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
