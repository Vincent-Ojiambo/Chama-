import mongoose from 'mongoose';
import Meeting from '../models/Meeting.js';
import Chama from '../models/Chama.js';
import { sendMeetingNotification } from '../utils/notificationService.js';

// @desc    Create a new meeting (Admin)
// @route   POST /api/admin/meetings
// @access  Private/Admin
export const createMeeting = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, date, time, location, meetingLink, agenda, type } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !date || !time || !agenda || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, time, agenda, and type are required fields'
      });
    }

    // Find the chama where the user is an admin
    const chama = await Chama.findOne({ admin: userId }).session(session);
    
    if (!chama) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create meetings for any chama'
      });
    }

    // Create new meeting
    const newMeeting = new Meeting({
      title,
      date: new Date(date),
      time,
      location: type === 'physical' ? location : 'Online',
      meetingLink: type === 'online' ? meetingLink : undefined,
      agenda: agenda.split('\n')
        .filter(item => item.trim() !== '')
        .map(item => ({
          topic: item.trim(),
          duration: 15, // Default duration in minutes
          status: 'pending'
        })),
      type,
      chama: chama._id,
      createdBy: userId
    });

    await newMeeting.save({ session });

    // Send notifications to chama members
    await sendMeetingNotification({
      meeting: newMeeting,
      chamaId: chama._id,
      senderId: userId,
      type: 'new_meeting',
      session
    });

    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      data: newMeeting,
      message: 'Meeting created successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating meeting',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get all meetings for admin's chama
// @route   GET /api/admin/meetings
// @access  Private/Admin
export const getMeetings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find the chama where the user is an admin
    const chama = await Chama.findOne({ admin: userId });
    
    if (!chama) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view meetings for any chama'
      });
    }

    const meetings = await Meeting.find({ chama: chama._id })
      .sort({ date: 1, time: 1 })
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (error) {
    console.error('Error getting admin meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get meeting details (Admin)
// @route   GET /api/admin/meetings/:id
// @access  Private/Admin
export const getMeetingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the chama where the user is an admin
    const chama = await Chama.findOne({ admin: userId });
    
    if (!chama) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view meetings for any chama'
      });
    }

    // Find the meeting
    const meeting = await Meeting.findOne({ _id: id, chama: chama._id })
      .populate('createdBy', 'name email')
      .populate('attendees.user', 'name email');
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found or you are not authorized to view it'
      });
    }
    
    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (error) {
    console.error('Error getting meeting details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update a meeting (Admin)
// @route   PUT /api/admin/meetings/:id
// @access  Private/Admin
export const updateMeeting = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { title, date, time, location, meetingLink, agenda, type } = req.body;
    const userId = req.user._id;

    // Find the chama where the user is an admin
    const chama = await Chama.findOne({ admin: userId }).session(session);
    
    if (!chama) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update meetings for any chama'
      });
    }

    // Find the meeting
    const meeting = await Meeting.findOne({ _id: id, chama: chama._id }).session(session);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found or you are not authorized to update it'
      });
    }

    // Update meeting fields
    meeting.title = title || meeting.title;
    meeting.date = date ? new Date(date) : meeting.date;
    meeting.time = time || meeting.time;
    meeting.type = type || meeting.type;
    
    if (type === 'physical') {
      meeting.location = location || meeting.location;
      meeting.meetingLink = undefined;
    } else {
      meeting.location = 'Online';
      meeting.meetingLink = meetingLink || meeting.meetingLink;
    }
    
    if (agenda) {
      meeting.agenda = agenda.split('\n')
        .filter(item => item.trim() !== '')
        .map(item => ({
          topic: item.trim(),
          duration: 15, // Default duration in minutes
          status: 'pending'
        }));
    }

    await meeting.save({ session });

    // Send update notification to members
    await sendMeetingNotification({
      meeting,
      chamaId: chama._id,
      senderId: userId,
      type: 'meeting_updated',
      session
    });

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: meeting,
      message: 'Meeting updated successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meeting',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// @desc    Delete a meeting (Admin)
// @route   DELETE /api/admin/meetings/:id
// @access  Private/Admin
export const deleteMeeting = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the chama where the user is an admin
    const chama = await Chama.findOne({ admin: userId }).session(session);
    
    if (!chama) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete meetings for any chama'
      });
    }

    // Find and delete the meeting
    const meeting = await Meeting.findOneAndDelete({ 
      _id: id, 
      chama: chama._id 
    }).session(session);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found or you are not authorized to delete it'
      });
    }

    // Send cancellation notification to members
    await sendMeetingNotification({
      meeting,
      chamaId: chama._id,
      senderId: userId,
      type: 'meeting_cancelled',
      session
    });

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meeting',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// @desc    Update meeting agenda item status (Admin)
// @route   PATCH /api/admin/meetings/:id/agenda/:agendaId/status
// @access  Private/Admin
export const updateAgendaStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id, agendaId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    // Find the chama where the user is an admin
    const chama = await Chama.findOne({ admin: userId }).session(session);
    
    if (!chama) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update meetings for any chama'
      });
    }

    // Find the meeting
    const meeting = await Meeting.findOne({ _id: id, chama: chama._id }).session(session);
    
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found or you are not authorized to update it'
      });
    }

    // Find and update the agenda item
    const agendaItem = meeting.agenda.id(agendaId);
    if (!agendaItem) {
      return res.status(404).json({
        success: false,
        message: 'Agenda item not found'
      });
    }

    agendaItem.status = status || agendaItem.status;
    await meeting.save({ session });
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      data: meeting,
      message: 'Agenda item status updated successfully'
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating agenda status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating agenda status',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};
