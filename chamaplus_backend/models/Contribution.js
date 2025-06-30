import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema(
  {
    chama: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chama",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "mobile_money", "bank_transfer", "other"],
      default: "cash",
    },
    paymentReference: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    receipt: {
      type: String, // URL to receipt image/document
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending"
    },
    verificationNotes: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
ContributionSchema.virtual("isLate").get(function() {
  const chama = this.chama;
  if (!chama) return false;
  
  const dueDate = new Date(this.createdAt);
  dueDate.setDate(dueDate.getDate() + 1); // 1 day grace period
  
  return new Date() > dueDate;
});

ContributionSchema.virtual("isVerified").get(function() {
  return this.verificationStatus === "verified";
});

// Indexes
ContributionSchema.index({ chama: 1, createdAt: -1 });
ContributionSchema.index({ user: 1, createdAt: -1 });
ContributionSchema.index({ status: 1 });
ContributionSchema.index({ verificationStatus: 1 });
ContributionSchema.index({ transactionId: 1 });

// Methods
ContributionSchema.methods.calculateLateFee = function() {
  if (!this.isLate) return 0;
  
  const chama = this.chama;
  if (!chama?.contributionAmount) return 0;
  
  const daysLate = Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
  return chama.contributionAmount * 0.05 * daysLate; // 5% daily late fee
};

ContributionSchema.methods.markAsVerified = async function(verifierId, notes = "") {
  this.verificationStatus = "verified";
  this.verifiedBy = verifierId;
  this.verificationNotes = notes;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

ContributionSchema.methods.rejectVerification = async function(rejectorId, notes) {
  this.verificationStatus = "rejected";
  this.verifiedBy = rejectorId;
  this.verificationNotes = notes;
  this.updatedAt = new Date();
  await this.save();
  return this;
};

export default mongoose.model("Contribution", ContributionSchema);
