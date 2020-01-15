const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  location: {
    street: String,
    city: String,
    county: String,
    postcode: String,
    country: String
  },
  jobDetails: String,
  speciality: String,
  timeNeeded: Number,
  reward: Number,
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active"
  },
  date: String,
  appliedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  taskTaker: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  messages: [
    {
      senderName: String,
      message: String,
      date: String
    }
  ]
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
