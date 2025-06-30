import mongoose from "mongoose";

const ChamaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Chama name is required"],
      trim: true,
      maxlength: [50, "Chama name cannot exceed 50 characters"],
      minlength: [2, "Chama name must be at least 2 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    contributionAmount: {
      type: Number,
      required: [true, 'Contribution amount is required'],
      min: [0, 'Contribution amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'KSh',
      enum: ['KSh', 'USD', 'EUR'],
    },
    bankDetails: {
      bankName: {
        type: String,
        default: '',
      },
      accountNumber: {
        type: String,
        default: '',
      },
      branch: {
        type: String,
        default: '',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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
ChamaSchema.virtual("totalMembers").get(function () {
  return this.members.length;
});

ChamaSchema.virtual("activeMembers").get(function () {
  return this.members.filter(member => member.isActive).length;
});

ChamaSchema.virtual("inactiveMembers").get(function () {
  return this.members.length - this.activeMembers;
});

// Methods
// Indexes
ChamaSchema.index({ name: 'text', description: 'text' });
ChamaSchema.index({ admin: 1 });
ChamaSchema.index({ members: 1 });
ChamaSchema.index({ isActive: 1 });
ChamaSchema.index({ createdAt: -1 });

// Create and export the model
const Chama = mongoose.model('Chama', ChamaSchema);

export default Chama;
