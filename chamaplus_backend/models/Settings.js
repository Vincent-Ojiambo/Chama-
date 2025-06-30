import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  language: {
    type: String,
    enum: ["English", "Swahili"],
    default: "English"
  },
  currency: {
    type: String,
    enum: ["KSH", "USD", "EUR"],
    default: "KSH"
  },
  timezone: {
    type: String,
    default: "Africa/Nairobi"
  },
  notifications: {
    type: Boolean,
    default: true
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  autoLogin: {
    type: Boolean,
    default: true
  },
  showTips: {
    type: Boolean,
    default: true
  },
  updateFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "weekly"
  },
  theme: {
    type: String,
    enum: ["system", "light", "dark"],
    default: "system"
  },
  notificationSound: {
    type: Boolean,
    default: true
  },
  notificationVibration: {
    type: Boolean,
    default: true
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
SettingsSchema.virtual("isDarkMode").get(function() {
  return this.darkMode || (this.theme === "dark");
});

// Indexes
SettingsSchema.index({ user: 1 });
SettingsSchema.index({ theme: 1 });
SettingsSchema.index({ language: 1 });

// Methods
SettingsSchema.methods.updateSettings = async function(updates) {
  Object.assign(this, updates);
  this.updatedAt = new Date();
  await this.save();
  return this;
};

export default mongoose.model("Settings", SettingsSchema);
