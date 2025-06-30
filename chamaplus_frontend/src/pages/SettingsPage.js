import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiBell, FiSettings, FiLock, FiDatabase, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import AppHeader from '../components/AppHeader';

// Tab configuration
const tabs = [
  { id: 'notifications', name: 'Notifications', icon: FiBell },
  { id: 'app', name: 'App Settings', icon: FiSettings },
  { id: 'security', name: 'Security', icon: FiLock },
  { id: 'backup', name: 'Backup & Restore', icon: FiDatabase },
  { id: 'privacy', name: 'Privacy', icon: FiShield }
];

function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  
  // User info for header
  const userInfo = {
    name: "John Doe",
    email: "admin@chamaplus.com"
  };
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
  });

  // App settings state
  const [appSettings, setAppSettings] = useState({
    currency: 'KSH',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    autoUpdate: true,
    showTips: true,
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    passwordProtected: true,
    biometricAuth: false,
    sessionTimeout: 30, // minutes
  });

  // Backup settings state
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'weekly',
    lastBackup: null,
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    analytics: true,
    locationTracking: false,
    privacyMode: false,
    hideBalance: false,
  });

  // Handle notification settings changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle app settings changes
  const handleAppSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle security settings changes
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle backup settings changes
  const handleBackupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBackupSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle privacy settings changes
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  // Handle backup now
  const handleBackupNow = () => {
    setIsSaving(true);
    // Simulate backup process
    setTimeout(() => {
      setBackupSettings(prev => ({
        ...prev,
        lastBackup: new Date().toISOString()
      }));
      setIsSaving(false);
      toast.success('Backup completed successfully!');
    }, 1500);
  };

  // Handle restore
  const handleRestore = () => {
    toast.info('Restore functionality will be implemented soon');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Email Notifications</label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">SMS Notifications</label>
              <input
                type="checkbox"
                name="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        );
      case 'app':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Currency</label>
              <select
                name="currency"
                value={appSettings.currency}
                onChange={handleAppSettingChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="KSH">Kenya Shilling (KSH)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Language</label>
              <select
                name="language"
                value={appSettings.language}
                onChange={handleAppSettingChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Auto-update</label>
              <input
                type="checkbox"
                name="autoUpdate"
                checked={appSettings.autoUpdate}
                onChange={handleAppSettingChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Password Protection</label>
              <input
                type="checkbox"
                name="passwordProtected"
                checked={securitySettings.passwordProtected}
                onChange={handleSecurityChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Biometric Authentication</label>
              <input
                type="checkbox"
                name="biometricAuth"
                checked={securitySettings.biometricAuth}
                onChange={handleSecurityChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={securitySettings.sessionTimeout}
                onChange={handleSecurityChange}
                min="1"
                max="120"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        );
      case 'backup':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Auto Backup</label>
              <input
                type="checkbox"
                name="autoBackup"
                checked={backupSettings.autoBackup}
                onChange={handleBackupChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Backup Frequency</label>
              <select
                name="backupFrequency"
                value={backupSettings.backupFrequency}
                onChange={handleBackupChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleBackupNow}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {isSaving ? 'Backing up...' : 'Backup Now'}
              </button>
              <button
                onClick={handleRestore}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Restore
              </button>
            </div>
            {backupSettings.lastBackup && (
              <p className="text-sm text-gray-500">
                Last backup: {new Date(backupSettings.lastBackup).toLocaleString()}
              </p>
            )}
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Share Analytics</label>
              <input
                type="checkbox"
                name="analytics"
                checked={privacySettings.analytics}
                onChange={handlePrivacyChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Location Tracking</label>
              <input
                type="checkbox"
                name="locationTracking"
                checked={privacySettings.locationTracking}
                onChange={handlePrivacyChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-700 font-medium">Hide Balance</label>
              <input
                type="checkbox"
                name="hideBalance"
                checked={privacySettings.hideBalance}
                onChange={handlePrivacyChange}
                className="form-checkbox h-6 w-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        profile={{
          name: userInfo.name,
          email: userInfo.email
        }}
        onMenuClick={() => navigate('/menu')}
        onLogout={handleLogout}
        onNavigateToSettings={() => navigate('/settings')}
        onNavigateToNotifications={() => navigate('/notifications')}
        onNavigateToActivityLog={() => navigate('/activity')}
      />
      
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex items-center mb-4 sm:mb-6">
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-blue-100">Manage your account preferences</p>
          </div>
          
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex -mb-px min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-3 sm:py-4 px-3 sm:px-6 text-center border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    flex items-center justify-center space-x-1 sm:space-x-2
                  `}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4 sm:space-y-6">
                {renderTabContent()}
              </div>
              
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
