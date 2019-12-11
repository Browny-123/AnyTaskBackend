const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const ratingSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  rating: Number,
  comment: String
});

const ratingModel = mongoose.model("Rating", ratingSchema);

module.exports = ratingModel;
