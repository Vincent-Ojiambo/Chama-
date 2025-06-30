import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    chama: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chama",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Time must be in HH:MM format",
      },
    },
    location: {
      type: String,
      trim: true,
    },
    agenda: [{
      topic: {
        type: String,
        required: true,
        trim: true,
      },
      duration: {
        type: Number,
        required: true,
        min: 1,
      },
      responsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["completed", "pending", "cancelled"],
        default: "pending"
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    attendees: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["attending", "absent", "late", "excused"],
        default: "attending",
      },
      notes: {
        type: String,
        trim: true,
      },
      arrivalTime: {
        type: String,
        validate: {
          validator: function (v) {
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
          },
          message: "Arrival time must be in HH:MM format",
        },
      }
    }],
    minutes: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    attachments: [{
      fileName: {
        type: String,
        required: true
      },
      fileType: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    meetingLink: {
      type: String,
      trim: true
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    virtualPlatform: {
      type: String,
      enum: ["Zoom", "Teams", "Google Meet", "Other"],
      default: "Other"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
MeetingSchema.virtual("isUpcoming").get(function() {
  const meetingTime = new Date(this.date);
  meetingTime.setHours(...this.time.split(':'));
  return meetingTime > new Date();
});

MeetingSchema.virtual("isPast").get(function() {
  return !this.isUpcoming;
});

MeetingSchema.virtual("attendanceRate").get(function() {
  const total = this.attendees.length;
  const attending = this.attendees.filter(a => a.status === "attending").length;
  return total > 0 ? (attending / total) * 100 : 0;
});

MeetingSchema.virtual("lateRate").get(function() {
  const total = this.attendees.length;
  const late = this.attendees.filter(a => a.status === "late").length;
  return total > 0 ? (late / total) * 100 : 0;
});

// Indexes
MeetingSchema.index({ chama: 1, date: 1 });
MeetingSchema.index({ date: -1 });
MeetingSchema.index({ "attendees.userId": 1 });
MeetingSchema.index({ "agenda.responsible": 1 });

// Methods
MeetingSchema.methods.calculateAgendaProgress = function() {
  const totalItems = this.agenda.length;
  const completedItems = this.agenda.filter(item => item.status === "completed").length;
  return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
};

MeetingSchema.methods.markAgendaItemAsCompleted = async function(itemId, notes = "") {
  const item = this.agenda.id(itemId);
  if (!item) return;
  
  item.status = "completed";
  item.notes = notes;
  await this.save();
  return this;
};

MeetingSchema.methods.updateAttendeeStatus = async function(userId, status, notes = "", arrivalTime = null) {
  const attendee = this.attendees.find(a => a.userId.toString() === userId.toString());
  if (!attendee) return;
  
  attendee.status = status;
  if (notes) attendee.notes = notes;
  if (arrivalTime) attendee.arrivalTime = arrivalTime;
  
  await this.save();
  return this;
};

MeetingSchema.methods.addAttachment = async function(file) {
  this.attachments.push(file);
  await this.save();
  return this;
};

export default mongoose.model("Meeting", MeetingSchema);
