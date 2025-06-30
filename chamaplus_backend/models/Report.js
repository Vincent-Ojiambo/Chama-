import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  chama: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chama",
    required: true
  },
  type: {
    type: String,
    enum: ["financial", "attendance", "activity", "loan"],
    required: true
  },
  period: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },
  error: {
    type: String
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
ReportSchema.virtual("isCurrent").get(function() {
  const now = new Date();
  return this.endDate >= now;
});

// Indexes
ReportSchema.index({ chama: 1, type: 1, period: 1, startDate: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ type: 1, period: 1 });

// Methods
ReportSchema.methods.generateFinancialReport = async function(chama) {
  const startDate = this.startDate;
  const endDate = this.endDate;

  const contributions = await Contribution.find({
    chama: chama._id,
    createdAt: { $gte: startDate, $lte: endDate }
  }).populate({
    path: "user",
    select: "name"
  });

  const loans = await Loan.find({
    chama: chama._id,
    createdAt: { $gte: startDate, $lte: endDate }
  }).populate({
    path: "borrower approvedBy",
    select: "name"
  });

  const reportData = {
    totalContributions: contributions.reduce((sum, c) => sum + c.amount, 0),
    totalLoans: loans.reduce((sum, l) => sum + l.amount, 0),
    activeLoans: loans.filter(l => l.status === "approved").length,
    defaultedLoans: loans.filter(l => l.status === "paid").length,
    contributionStats: {
      byUser: contributions.reduce((acc, c) => {
        acc[c.user._id] = (acc[c.user._id] || 0) + c.amount;
        return acc;
      }, {}),
      totalContributors: new Set(contributions.map(c => c.user._id)).size
    }
  };

  this.data = reportData;
  this.status = "completed";
  await this.save();
  return this;
};

ReportSchema.methods.generateAttendanceReport = async function(chama) {
  const startDate = this.startDate;
  const endDate = this.endDate;

  const meetings = await Meeting.find({
    chama: chama._id,
    date: { $gte: startDate, $lte: endDate }
  }).populate({
    path: "attendees.userId",
    select: "name"
  });

  const reportData = {
    totalMeetings: meetings.length,
    attendanceStats: meetings.reduce((acc, meeting) => {
      const total = meeting.attendees.length;
      const attending = meeting.attendees.filter(a => a.status === "attending").length;
      const absent = meeting.attendees.filter(a => a.status === "absent").length;
      const late = meeting.attendees.filter(a => a.status === "late").length;
      
      acc.meetings.push({
        date: meeting.date,
        total,
        attending,
        absent,
        late,
        attendanceRate: (attending / total) * 100
      });
      
      acc.overall.total += total;
      acc.overall.attending += attending;
      acc.overall.absent += absent;
      acc.overall.late += late;
      
      return acc;
    }, {
      meetings: [],
      overall: {
        total: 0,
        attending: 0,
        absent: 0,
        late: 0
      }
    })
  };

  this.data = reportData;
  this.status = "completed";
  await this.save();
  return this;
};

export default mongoose.model("Report", ReportSchema);
