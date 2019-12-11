const express = require("express");
const router = new express.Router();
const taskModel = require("./../models/TaskModel");

router.post("/createtask", (req, res, next) => {
  //   console.log(req.session.passport);
  console.log(req.body);
  console.log(req.user);
  // taskModel
  //   .create("req.body")
  //   .then(res => {
  //     res.status(200).json("Task Created Succesfully");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
});

module.exports = router;
