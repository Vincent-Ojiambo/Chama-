import React, { useState, useEffect } from "react";
import { Bell, Menu, LogOut, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const AdminHeader = ({ onMenuClick, isMobile }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    const loadProfile = () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile({
            name: parsedProfile.name || 'Admin',
            email: parsedProfile.email || '',
            avatar: parsedProfile.profilePhoto || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 text-white h-16 fixed top-0 left-0 right-0 z-50 shadow-lg flex items-center" style={{ background: 'linear-gradient(to right, #1a5f1a, #1e40af, #6b21a8)' }}>
      <div className="w-full">
        <div className="flex justify-between items-center h-full px-4 md:px-6">
          {/* Left side */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={onMenuClick}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin/dashboard" className="flex items-center">
                <img
                  src="/logo192.png"
                  alt="ChamaPlus Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow"
                  loading="eager"
                />
                <div className="ml-2 flex items-center">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg tracking-wide text-blue-300">Chama</span>
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg tracking-wide text-white">Plus</span>
                  <span className="ml-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg tracking-wide text-white">Admin</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 sm:p-2.5 rounded-full hover:bg-white/20 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-white" />
            </button>
            
            {/* Profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center max-w-xs rounded-full bg-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {profile.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profile.avatar}
                      alt={profile.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </button>
              </div>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {profile.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile.email}
                      </p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Your Profile
                      </div>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
