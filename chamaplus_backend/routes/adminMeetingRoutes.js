import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createMeeting,
  getMeetings,
  getMeetingDetails,
  updateMeeting,
  deleteMeeting,
  updateAgendaStatus
} from '../controllers/adminMeetingController.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

// Routes for /api/admin/meetings
router
  .route('/')
  .post(createMeeting)    // Create a new meeting
  .get(getMeetings);     // Get all meetings for admin's chama

// Routes for /api/admin/meetings/:id
router
  .route('/:id')
  .get(getMeetingDetails)  // Get meeting details
  .put(updateMeeting)     // Update meeting
  .delete(deleteMeeting); // Delete meeting

// Route for updating agenda item status
router.patch('/:id/agenda/:agendaId/status', updateAgendaStatus);

export default router;
