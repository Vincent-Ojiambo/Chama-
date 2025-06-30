import mongoose from 'mongoose';
import Chama from '../models/Chama.js';

const createChama = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, description, contributionAmount, currency, bankName, accountNumber, isActive } = req.body;
    const adminId = req.user._id; // Assuming user is attached to request by auth middleware
    
    // Validate required fields
    if (!name || !description || !contributionAmount) {
      return res.status(400).json({ message: 'Name, description, and contribution amount are required' });
    }

    // Check if admin already has a chama
    const existingChama = await Chama.findOne({ admin: adminId }).session(session);
    if (existingChama) {
      return res.status(400).json({ message: 'You already have a chama' });
    }

    // Create new chama
    const newChama = new Chama({
      name,
      description,
      contributionAmount: Number(contributionAmount),
      currency: currency || 'KSh',
      bankDetails: bankName || accountNumber ? {
        bankName: bankName || '',
        accountNumber: accountNumber || ''
      } : undefined,
      isActive: isActive !== undefined ? isActive : true,
      admin: adminId,
      members: [adminId] // Add admin as first member
    });

    await newChama.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: newChama,
      message: 'Chama created successfully'
    });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    console.error('Error creating chama:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating chama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  } finally {
    // End the session
    session.endSession();
  }
};

const getChamas = async (req, res) => {
  try {
    const chamas = await Chama.find({})
      .populate('admin', 'name email')
      .populate('members', 'name email');
    
    res.status(200).json({
      success: true,
      count: chamas.length,
      data: chamas
    });
  } catch (error) {
    console.error('Error fetching chamas:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chamas',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

const getChamaDetails = async (req, res) => {
  try {
    const chama = await Chama.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');
    
    if (!chama) {
      return res.status(404).json({
        success: false,
        message: 'Chama not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chama
    });
  } catch (error) {
    console.error('Error fetching chama details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chama details',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

const updateChama = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, description, contributionAmount, currency, bankName, accountNumber, isActive } = req.body;
    const chamaId = req.params.id;
    
    // Check if chama exists and user is the admin
    const chama = await Chama.findById(chamaId).session(session);
    if (!chama) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Chama not found' });
    }
    
    if (chama.admin.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to update this chama' });
    }
    
    // Update chama fields
    if (name) chama.name = name;
    if (description) chama.description = description;
    if (contributionAmount) chama.contributionAmount = Number(contributionAmount);
    if (currency) chama.currency = currency;
    if (isActive !== undefined) chama.isActive = isActive;
    
    // Update bank details if provided
    if (bankName || accountNumber) {
      chama.bankDetails = {
        bankName: bankName || chama.bankDetails?.bankName || '',
        accountNumber: accountNumber || chama.bankDetails?.accountNumber || '',
        branch: chama.bankDetails?.branch || ''
      };
    }
    
    await chama.save({ session });
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: chama,
      message: 'Chama updated successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating chama:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating chama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  } finally {
    session.endSession();
  }
};

const deleteChama = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const chamaId = req.params.id;
    
    // Check if chama exists and user is the admin
    const chama = await Chama.findById(chamaId).session(session);
    if (!chama) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Chama not found' });
    }
    
    if (chama.admin.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: 'Not authorized to delete this chama' });
    }
    
    // Delete the chama
    await Chama.findByIdAndDelete(chamaId).session(session);
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: 'Chama deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting chama:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting chama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  } finally {
    session.endSession();
  }
};

// Get the current user's chama
const getMyChama = async (req, res) => {
  try {
    const chama = await Chama.findOne({ admin: req.user._id })
      .populate('admin', 'name email')
      .populate('members', 'name email');
    
    if (!chama) {
      return res.status(404).json({
        success: false,
        message: 'No chama found for this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: chama
    });
  } catch (error) {
    console.error('Error fetching chama:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chama',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
};

export {
  createChama,
  getChamas,
  getChamaDetails,
  updateChama,
  deleteChama,
  getMyChama
};
