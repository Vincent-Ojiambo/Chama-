// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");
// const {
//   getDashboardStats,
//   getRecentActivities,
//   getUpcomingEvents,
// } = require("../controllers/dashboardController");

// // Protected routes (require valid JWT)
// router.get("/stats", protect, getDashboardStats);
// router.get("/activities/recent", protect, getRecentActivities);
// router.get("/events/upcoming", protect, getUpcomingEvents);

// module.exports = router;

// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getRecentActivities,
  getUpcomingEvents,
} = require("../controllers/dashboardController");

// Protected routes (require valid JWT)
router.get("/stats", protect, getDashboardStats);
router.get("/activities/recent", protect, getRecentActivities);
router.get("/events/upcoming", protect, getUpcomingEvents);

module.exports = router;
