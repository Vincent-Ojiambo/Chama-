import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["contribution", "loan", "meeting", "profile", "chama"],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  category: {
    type: String,
    enum: ["success", "info", "warning", "error"],
    default: "info"
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
ActivityLogSchema.virtual("isRecent").get(function() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return this.createdAt >= oneWeekAgo;
});

// Indexes
ActivityLogSchema.index({ user: 1, createdAt: -1 });
ActivityLogSchema.index({ type: 1, createdAt: -1 });
ActivityLogSchema.index({ category: 1, createdAt: -1 });

// Methods
ActivityLogSchema.methods.formatAction = function() {
  const actions = {
    contribution: {
      create: "made a contribution",
      update: "updated a contribution",
      delete: "deleted a contribution"
    },
    loan: {
      create: "applied for a loan",
      update: "updated loan details",
      delete: "deleted loan"
    },
    meeting: {
      create: "scheduled a meeting",
      update: "updated meeting details",
      delete: "deleted meeting"
    },
    profile: {
      update: "updated profile"
    },
    chama: {
      create: "created a new chama",
      update: "updated chama details",
      delete: "deleted chama"
    }
  };

  return actions[this.type]?.[this.action] || this.action;
};

export default mongoose.model("ActivityLog", ActivityLogSchema);
