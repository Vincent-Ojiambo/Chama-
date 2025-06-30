const mongoose = require("mongoose");

const ContributionSchema = new mongoose.Schema(
  {
    amount: Number,
    member: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chama: { type: mongoose.Schema.Types.ObjectId, ref: "Chama" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contribution", ContributionSchema);
