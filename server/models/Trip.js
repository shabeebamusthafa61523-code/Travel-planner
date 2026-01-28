const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  destination: { type: String,required:true },
  startDate: { type: Date },
  endDate: { type: Date},
  activities: [String],
 itinerary: [
  {
    day: Number,
    name: String,
    category: String,
    cost: Number,
  }
]


});

module.exports = mongoose.model("Trip", tripSchema);
