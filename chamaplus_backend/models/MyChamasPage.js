const mongoose = require("mongoose");

const ChamaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  contributionAmount: { type: Number, required: true },
  contributionFrequency: { type: String, default: "monthly" },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        enum: ["member", "treasurer", "chairperson"],
        default: "member",
      },
    },
  ],
  totalFunds: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chama", ChamaSchema);
