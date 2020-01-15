const express = require("express");
const router = new express.Router();
const taskModel = require("./../models/TaskModel");

router.get("/messages/user/:id", (req, res) => {
  const user = req.user._id;

  taskModel
    .find({ $or: [{ taskTaker: user }, { ownerId: user }] })
    .populate("ownerId")
    .populate("taskTaker")
    .then(dbRes => {
      res.status(200).send(dbRes);
    })
    .catch(dbErr => console.log(dbErr));
});

router.get("/send-message/:id", (req, res) => {
  const jobId = req.params.id;

  taskModel
    .find({ _id: jobId })
    .populate("ownerId")
    .then(dbRes => {
      res.status(200).send(dbRes[0].ownerId.name);
    })
    .catch(dbErr => {
      res.status(500).send("Error Obtaining Informaiton");
    });
});

router.post("/send-message/:id", (req, res) => {
  const jobId = req.params.id;
  const message = req.body.message;
  const date = new Date().toLocaleString();

  if (message.length === 0) {
    res.status(200).send("Please Enter a Message");
    return;
  }
  taskModel
    .findByIdAndUpdate(jobId, {
      $push: {
        messages: {
          senderName: req.user.name,
          message: message,
          date: date
        }
      }
    })
    .then(dbRes => {
      res.status(200).send("Message Sent Successfully");
    })
    .catch(err =>
      res.status(500).send("Error in Sending Message, Please Try Again")
    );
});

module.exports = router;
