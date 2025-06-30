import Notification from '../models/Notification.js';
import Chama from '../models/Chama.js';

// Send meeting notification to chama members
export const sendMeetingNotification = async ({
  meeting,
  chamaId,
  senderId,
  type,
  session = null
}) => {
  try {
    // Find all members of the chama
    const chama = await (session 
      ? Chama.findById(chamaId).session(session).select('members admin') 
      : Chama.findById(chamaId).select('members admin')
    );

    if (!chama) {
      console.error('Chama not found for notification');
      return;
    }

    // Create notification for each member (excluding the sender)
    const recipients = chama.members.filter(
      memberId => memberId.toString() !== senderId.toString()
    );

    if (recipients.length === 0) return;

    let message = '';
    let title = '';

    switch (type) {
      case 'new_meeting':
        title = 'New Meeting Scheduled';
        message = `A new meeting "${meeting.title}" has been scheduled for ${meeting.date} at ${meeting.time}`;
        break;
      case 'meeting_updated':
        title = 'Meeting Updated';
        message = `The meeting "${meeting.title}" has been updated.`;
        break;
      case 'meeting_cancelled':
        title = 'Meeting Cancelled';
        message = `The meeting "${meeting.title}" has been cancelled.`;
        break;
      default:
        title = 'Meeting Notification';
        message = `You have a notification about the meeting "${meeting.title}"`;
    }

    const notifications = recipients.map(userId => ({
      user: userId,
      title,
      message,
      type: 'meeting',
      referenceId: meeting._id,
      read: false
    }));

    await Notification.insertMany(notifications, { session });

    // Here you would typically integrate with a real-time notification service
    // like Socket.IO or Firebase Cloud Messaging
    console.log(`Sent ${type} notifications to ${recipients.length} members`);
    
  } catch (error) {
    console.error('Error sending meeting notification:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

// Mark notification as read
export const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
