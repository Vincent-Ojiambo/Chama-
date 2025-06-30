import React from 'react';
import { Bell, CheckCircle, X, Clock, User, CreditCard, FileText } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = React.useState([
    {
      id: 1,
      title: 'New Contribution',
      message: 'Your monthly contribution of KSH 5000 has been successfully processed.',
      time: '10 minutes ago',
      type: 'success',
      read: false,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    {
      id: 2,
      title: 'Meeting Reminder',
      message: 'Chama meeting scheduled for tomorrow at 7:00 PM. Don't forget to attend!',
      time: '1 hour ago',
      type: 'info',
      read: false,
      icon: <Clock className="w-4 h-4 text-blue-500" />
    },
    {
      id: 3,
      title: 'Loan Approval',
      message: 'Your loan application for KSH 100,000 has been approved.',
      time: '1 day ago',
      type: 'success',
      read: true,
      icon: <CreditCard className="w-4 h-4 text-green-500" />
    },
    {
      id: 4,
      title: 'New Member',
      message: 'John Doe has joined your chama as a new member.',
      time: '2 days ago',
      type: 'info',
      read: true,
      icon: <User className="w-4 h-4 text-blue-500" />
    },
    {
      id: 5,
      title: 'Monthly Report',
      message: 'Your monthly chama report is ready to view.',
      time: '1 week ago',
      type: 'info',
      read: true,
      icon: <FileText className="w-4 h-4 text-blue-500" />
    }
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-sm text-gray-600 mt-1">Stay updated with your chama activities</p>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Mark All as Read
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start p-4 rounded-lg ${
                  notification.read ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {notification.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
