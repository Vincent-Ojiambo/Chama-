import mongoose from 'mongoose';
import Loan from '../models/Loan.js';
import User from '../models/User.js';
import Chama from '../models/Chama.js';

// @desc    Get all loans (for admin)
// @route   GET /api/loans
// @access  Private/Admin
export const getLoans = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const loans = await Loan.find(query)
      .populate('borrower', 'name email')
      .populate('chama', 'name')
      .sort({ dateIssued: -1 });
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error('Error getting loans:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single loan
// @route   GET /api/loans/:id
// @access  Private
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('borrower', 'name email')
      .populate('chama', 'name')
      .populate('guarantors', 'name email');
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error getting loan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update loan status
// @route   PUT /api/loans/:id/status
// @access  Private/Admin
export const updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const loan = await Loan.findById(id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    // Update loan status
    loan.status = status;
    
    // If approving the loan, set approval date and approved by
    if (status === 'approved') {
      loan.approvalDate = new Date();
      loan.approvedBy = req.user._id;
      
      // Create repayment schedule if not exists
      if (!loan.repaymentSchedule || loan.repaymentSchedule.length === 0) {
        const monthlyPayment = loan.amount / 6; // 6 months term
        const schedule = [];
        const startDate = new Date();
        
        for (let i = 1; i <= 6; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(startDate.getMonth() + i);
          
          schedule.push({
            amount: monthlyPayment,
            dueDate,
            status: i === 1 ? 'pending' : 'upcoming'
          });
        }
        
        loan.repaymentSchedule = schedule;
      }
    }
    
    await loan.save();
    
    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create a new loan
// @route   POST /api/loans
// @access  Private
export const createLoan = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { amount, purpose, chamaId, guarantorIds } = req.body;
    
    // Validate required fields
    if (!amount || !purpose || !chamaId) {
      return res.status(400).json({
        success: false,
        message: 'Amount, purpose, and chama ID are required'
      });
    }
    
    // Check if chama exists
    const chama = await Chama.findById(chamaId).session(session);
    if (!chama) {
      return res.status(404).json({
        success: false,
        message: 'Chama not found'
      });
    }
    
    // Check if user is a member of the chama
    if (!chama.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request a loan from this chama'
      });
    }
    
    // Check if user has any outstanding loans
    const existingLoan = await Loan.findOne({
      borrower: req.user._id,
      chama: chamaId,
      status: { $in: ['pending', 'approved'] }
    }).session(session);
    
    if (existingLoan) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active or pending loan with this chama'
      });
    }
    
    // Create new loan
    const newLoan = new Loan({
      chama: chamaId,
      borrower: req.user._id,
      guarantors: guarantorIds || [],
      amount,
      purpose,
      status: 'pending',
      dateIssued: new Date()
    });
    
    await newLoan.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: newLoan,
      message: 'Loan request submitted successfully'
    });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    console.error('Error creating loan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating loan',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// @desc    Record a loan payment
// @route   POST /api/loans/:id/payments
// @access  Private
export const recordPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { amount, paymentDate } = req.body;
    const { id } = req.params;
    
    // Validate required fields
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }
    
    // Find the loan
    const loan = await Loan.findById(id).session(session);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    // Check if user is authorized
    if (loan.borrower.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to record payment for this loan'
      });
    }
    
    // Record payment
    const payment = {
      amount,
      date: paymentDate || new Date(),
      recordedBy: req.user._id,
      status: 'completed'
    };
    
    loan.payments.push(payment);
    
    // Update loan status if fully paid
    const totalPaid = loan.payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid >= loan.amount) {
      loan.status = 'paid';
      loan.datePaid = new Date();
    }
    
    await loan.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: loan,
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};
