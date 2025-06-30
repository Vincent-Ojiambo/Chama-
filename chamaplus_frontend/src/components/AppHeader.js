import React, { useState, useEffect } from "react";
import { Bell, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";

const AppHeader = ({
  logoUrl = "/logo512.png",
  onMenuClick,
  isMobile
}) => {
  const { currentUser } = useAuth();
  
  // Note: Redirection logic is handled in the main routing
  // to prevent conflicts and ensure consistent behavior
  
  // Get user profile data from localStorage or context
  const [profile, setProfile] = useState({
    name: 'User',
    avatar: '',
    email: ''
  });

  // Update profile when currentUser changes or localStorage is updated
  useEffect(() => {
    const updateProfileFromStorage = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile({
            name: parsedProfile.name || parsedProfile.profile?.name || 'User',
            avatar: parsedProfile.profilePhoto || 
                   parsedProfile.profile?.profilePhoto || '',
            email: parsedProfile.email || ''
          });
          return;
        }
        
        // Fallback to currentUser from context
        if (currentUser) {
          setProfile({
            name: currentUser.name || 'User',
            avatar: currentUser.profilePhoto || 
                   currentUser.profile?.profilePhoto || '',
            email: currentUser.email || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile from storage:', error);
        // Set default values on error
        setProfile({
          name: 'User',
          avatar: '',
          email: ''
        });
      }
    };

    // Initial load
    updateProfileFromStorage();

    // Listen for storage events to update when profile changes in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') {
        updateProfileFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Contribution",
      message: "Your monthly contribution has been successfully processed.",
      time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Chama meeting scheduled for tomorrow at 7:00 PM.",
      time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: "Loan Approval",
      message: "Your loan application has been approved.",
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'success'
    },
  ]);

  const handleNavigate = (page) => {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: page }));
  };

  const handleNavigateToNotifications = () => {
    handleNavigate('notifications');
    setIsNotificationsOpen(false);
  };

  const handleNavigateToActivityLog = () => {
    handleNavigate('activity-log');
    setIsProfileCardOpen(false);
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For notifications
      if (isNotificationsOpen && !event.target.closest('.notifications')) {
        setIsNotificationsOpen(false);
      }
      // For profile card - only close if clicking outside the profile card and profile button
      const profileButton = event.target.closest('button[aria-label="User profile"]');
      const profileCard = event.target.closest('.profile-card');
      if (isProfileCardOpen && !profileButton && !profileCard) {
        setIsProfileCardOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen, isProfileCardOpen]);

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <header className="bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 text-white h-16 fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-6 shadow-lg" style={{ background: 'linear-gradient(to right, #1a5f1a, #1e40af, #6b21a8)' }}>
      {/* Logo and title on the left */}
      <div className="flex items-center flex-1">
        <button
          className={`p-2 rounded-full bg-white/20 hover:bg-blue-200/30 focus:outline-none focus:ring-2 focus:ring-white ${isMobile ? 'mr-2' : 'hidden'}`}
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex items-center">
          <img
            src={logoUrl}
            alt="ChamaPlus Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow"
            loading="eager"
          />
          <div className="ml-2 flex items-center">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg tracking-wide text-blue-300">Chama</span>
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg tracking-wide text-white">Plus</span>
          </div>
        </div>
      </div>
      
      {/* Navigation and user controls on the right */}
      <div className="flex items-center space-x-3 md:space-x-5 lg:space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 sm:p-2.5 rounded-full hover:bg-white/20 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white relative notifications"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} className="text-white" />
            {notifications.filter(notif => !notif.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {notifications.filter(notif => !notif.read).length}
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="fixed md:absolute right-2 left-2 md:left-auto top-16 md:top-14 md:right-0 w-auto md:w-80 max-w-full bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200 animate-fade-in" style={{ maxHeight: 'calc(100vh - 80px)', minWidth: '280px' }}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm sm:text-base font-medium text-gray-800">Notifications</h3>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Close notifications"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm sm:text-base">
                    No notifications
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto -mx-2 px-2">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-2 sm:p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
                          notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2 sm:space-x-3">
                            <div className={`flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'info' ? 'bg-blue-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <div className="min-w-0">
                              <h4 className="text-sm sm:text-base font-medium text-gray-800 truncate">{notification.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(notification.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 text-center">
                  <button
                    onClick={handleNavigateToNotifications}
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileCardOpen(!isProfileCardOpen)}
            className="flex items-center focus:outline-none group"
            aria-label="User profile"
            aria-expanded={isProfileCardOpen}
            aria-haspopup="true"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 flex items-center justify-center cursor-pointer hover:bg-white/20 rounded-full transition-colors">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full rounded-full border-2 border-white object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="h-full w-full rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-base">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          </button>
          
          {isProfileCardOpen && (
            <div 
              className="fixed md:absolute right-2 left-2 md:left-auto top-16 md:top-14 md:right-0 w-auto md:w-80 max-w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-visible z-50 animate-fade-in profile-card"
              style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto', minWidth: '280px' }}
              onClick={(e) => e.stopPropagation()}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex-shrink-0 relative">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="h-12 w-12 rounded-full border-2 border-white object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-lg">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{profile.name || 'User'}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{profile.email || 'No email provided'}</p>
                    {profile.phone && (
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{profile.phone}</p>
                    )}
                    <Link
                      to="/profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileCardOpen(false);
                      }}
                      className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors inline-block mt-1"
                      aria-label="View and edit profile"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
                <div className="space-y-1">
                  {currentUser?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileCardOpen(false);
                      }}
                      className="w-full text-left text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToActivityLog();
                    }}
                    className="w-full text-left text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    role="menuitem"
                  >
                    <Clock size={16} className="text-gray-600 flex-shrink-0" />
                    <span>Activity Log</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToNotifications();
                    }}
                    className="w-full text-left text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-gray-50"
                    role="menuitem"
                  >
                    <Bell size={16} className="text-gray-600 flex-shrink-0" />
                    <span>Notifications</span>
                    {notifications.filter(notif => !notif.read).length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5">
                        {notifications.filter(notif => !notif.read).length}
                      </span>
                    )}
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = '/';
                    }}
                    className="w-full text-left text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-red-50 mt-1"
                    role="menuitem"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Back to Home</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
