import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["contribution", "loan", "meeting", "system"],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
NotificationSchema.virtual("isUnread").get(function() {
  return !this.read;
});

// Indexes
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, createdAt: -1 });
NotificationSchema.index({ relatedId: 1 });

// Methods
NotificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.updatedAt = new Date();
  await this.save();
};

NotificationSchema.methods.markAsUnread = async function() {
  this.read = false;
  this.updatedAt = new Date();
  await this.save();
};

export default mongoose.model("Notification", NotificationSchema);
