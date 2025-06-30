// controllers/dashboardController.js
const Chama = require("../models/Chama");
const Contribution = require("../models/Contribution");
const Meeting = require("../models/Meeting");

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count user's active chamas
    const activeChamas = await Chama.countDocuments({
      members: userId,
      status: "active",
    });

    // Sum all user contributions
    const totalContributions = await Contribution.aggregate([
      {
        $match: { member: userId },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Count upcoming meetings
    const upcomingMeetings = await Meeting.countDocuments({
      chama: { $in: req.user.chamas },
      date: { $gte: new Date() },
    });

    res.json({
      activeChamas,
      totalContributions: totalContributions[0]?.total || 0,
      upcomingMeetings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get recent activities
// @route   GET /api/activities/recent
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const activities = await Contribution.find({
      member: req.user.id,
    })
      .sort("-createdAt")
      .limit(5)
      .populate("chama", "name");

    res.json(
      activities.map((activity) => ({
        id: activity._id,
        type: "Contribution",
        chamaName: activity.chama.name,
        amount: activity.amount,
        createdAt: activity.createdAt,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Private
exports.getUpcomingEvents = async (req, res) => {
  try {
    const events = await Meeting.find({
      chama: { $in: req.user.chamas },
      date: { $gte: new Date() },
    })
      .sort("date")
      .limit(3)
      .populate("chama", "name");

    res.json(
      events.map((event) => ({
        id: event._id,
        title: event.title,
        chamaName: event.chama.name,
        date: event.date,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
