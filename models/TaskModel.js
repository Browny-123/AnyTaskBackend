const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  userID: {
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
  details: String,
  speciality: Array,
  time: Number,
  price: Number,
  status: {
    type: String,
    enum: ["pending", "active", "closed"],
    default: "pending"
  },
  date: {
    startDate: String,
    startTime: String
  },
  appliedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  taskTaker: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
