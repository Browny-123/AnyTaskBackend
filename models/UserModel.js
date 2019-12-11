const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelSchema = new Schema({
  username: String,
  name: String,
  contactNumber: Number,
  email: String,
  password: String,
  address: {
    street: String,
    city: String,
    county: String,
    postcode: String,
    country: String
  },
  userPicture: String
});

const userModel = mongoose.model("User", modelSchema);

module.exports = userModel;
