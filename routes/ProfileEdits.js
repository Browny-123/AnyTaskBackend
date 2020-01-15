const express = require("express");
const router = new express.Router();
const userModel = require("./../models/UserModel");
const bcrypt = require("bcryptjs");

router.post("/updateProfile", (req, res, next) => {
  const userId = req.user._id;

  const {
    contactNumber,
    email,
    password,
    street,
    city,
    county,
    postcode,
    country
  } = req.body;

  const updatedProfileInfo = {
    contactNumber,
    email,
    address: {
      street,
      city,
      county,
      postcode,
      country
    }
  };

  if (password) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(password, salt);
    updatedProfileInfo.password = hashed;
  }
  userModel
    .findByIdAndUpdate(userId, updatedProfileInfo)
    .then(dbRes => {
      res.status(200).json("Profile updated Successfully");
    })
    .catch(dbErr => console.log(dbErr));
});

module.exports = router;
