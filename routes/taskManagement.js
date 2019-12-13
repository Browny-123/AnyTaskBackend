const express = require("express");
const router = new express.Router();
const taskModel = require("./../models/TaskModel");

router.post("/createtask", (req, res, next) => {
  const id = req.user._id;
  console.log(req.body);
  const {
    street,
    city,
    country,
    cost,
    timeNeeded,
    jobDetails,
    date,
    speciality
  } = req.body;

  const taskObj = {
    ownerId: id,
    location: {
      street,
      city,
      country
    },
    jobDetails,
    speciality,
    timeNeeded,
    cost,
    date
  };

  taskModel
    .create(taskObj)
    .then(dbRes => {
      res.status(200).json("Task Created Succesfully");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/searchJobs", (req, res, next) => {
  const searchCity = req.query.city;

  console.log(searchCity);

  taskModel
    .find({ "location.city": searchCity })
    .populate("ownerId")
    .then(dbRes => {
      console.log(dbRes);

      res.status(200).json(dbRes);
    })
    .catch(dbErr => console.log(dbErr));
});

router.post("/acceptedTask", (req, res, next) => {
  const jobId = req.body.jobId;
  const userId = req.user._id;

  taskModel
    .findByIdAndUpdate(jobId, { appliedUsers: userId })
    .then(dbRes => {
      console.log(dbRes);

      res.status(200).json("applied success");
    })
    .catch(dbErr => console.log(dbErr));
});

module.exports = router;
