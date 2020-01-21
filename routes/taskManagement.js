const express = require("express");
const router = new express.Router();
const taskModel = require("./../models/TaskModel");

router.post("/createtask", (req, res, next) => {
  const id = req.user._id;
  const city = req.body.city.toUpperCase();
  const {
    street,
    country,
    reward,
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
    taskTaker: null,
    timeNeeded,
    reward,
    date
  };

  taskModel
    .create(taskObj)
    .then(dbRes => {
      res.status(200).json("Task Created Succesfully");
    })
    .catch(err => {
      res.status(500).json("Error Creating Task, Please Try Again");
    });
});

router.get("/searchJobs", (req, res, next) => {
  const searchCity = req.query.city;

  const { _id } = req.user;

  taskModel
    .find({
      $and: [
        { "location.city": searchCity },
        { ownerId: { $ne: _id } },
        {
          appliedUsers: { $ne: _id }
        }
      ]
    })
    .populate("ownerId")
    .then(dbRes => {
      res.status(200).json(dbRes);
    })
    .catch(dbErr => console.log(dbErr));
});

router.post("/acceptedTask", (req, res, next) => {
  const jobId = req.body.jobId;
  const userId = req.user._id;

  taskModel
    .findByIdAndUpdate(jobId, { $push: { appliedUsers: userId } })
    .then(dbRes => {
      res.status(200).json("application successfull");
    })
    .catch(dbErr => console.log(dbErr));
});

router.get("/activeTasks", (req, res, next) => {
  const userId = req.user._id;
  taskModel
    .find({ appliedUsers: userId })
    .then(dbRes => res.status(200).json(dbRes))
    .catch(err => console.log(err));
});

router.get("/view-job-listings/:id", (req, res, next) => {
  const userId = req.user._id;

  taskModel
    .find({ ownerId: userId })
    .populate("ownerId")
    .populate("appliedUsers")
    .then(dbRes => {
      res.status(200).json(dbRes);
    })
    .catch(dbErr => res.status(500).json("Error from database"));
});

router.post("/job-taker-selected/:id", (req, res, next) => {
  const jobId = req.params.id;

  taskModel
    .findByIdAndUpdate(jobId, {
      taskTaker: req.body.appliedUser,
      status: "closed"
    })
    .then(dbRes => res.status(200).json("Task Assigned Successfully"))
    .catch(err => res.status(200).json("Database Error, Please Try Again"));
});

module.exports = router;
