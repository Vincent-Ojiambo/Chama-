import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getLoans,
  getLoanById,
  updateLoanStatus,
  createLoan,
  recordPayment
} from '../controllers/loanController.js';

const router = express.Router();

// Routes for /api/loans
router
  .route('/')
  .get(protect, admin, getLoans) // Get all loans (admin only)
  .post(protect, createLoan); // Create a new loan

// Routes for /api/loans/:id
router
  .route('/:id')
  .get(protect, getLoanById) // Get loan by ID
  .put(protect, updateLoanStatus); // Update loan status (admin only)

// Route for recording payments
router.post('/:id/payments', protect, recordPayment);

export default router;
