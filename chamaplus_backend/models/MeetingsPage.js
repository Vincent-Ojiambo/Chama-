const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: String,
  date: Date,
  chama: { type: mongoose.Schema.Types.ObjectId, ref: "Chama" },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
