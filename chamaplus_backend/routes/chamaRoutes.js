import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createChama,
  getChamas,
  getChamaDetails,
  updateChama,
  deleteChama,
  getMyChama
} from '../controllers/chamaController.js';

const router = express.Router();

// Route: /api/chamas/
router
  .route('/')
  .post(protect, createChama) // Create a new chama
  .get(protect, getChamas); // Get all chamas (admin only)

// Route to get the current user's chama
router.get('/my-chama', protect, getMyChama);

// Route: /api/chamas/:id
router
  .route('/:id')
  .get(protect, getChamaDetails) // Get specific chama details
  .put(protect, updateChama) // Update a chama
  .delete(protect, deleteChama); // Delete a chama

export default router;
