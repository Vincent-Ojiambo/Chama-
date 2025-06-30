import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Camera, MapPin, Calendar, Globe, MessageSquare, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../App';

// Default profile state
const defaultProfileState = {
  name: '',
  email: '',
  phone: '',
  profilePhoto: '',
  bio: '',
  location: '',
  dateOfBirth: '',
  gender: 'prefer-not-to-say',
  preferredLanguage: 'en',
  preferredCurrency: 'KES',
  timezone: 'Africa/Nairobi',
  notifications: {
    email: true,
    sms: true,
    push: true
  },
  socialLinks: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  }
};

const ProfileSettingsPage = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [user, setUser] = useState({
    id: currentUser?._id || '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    profile: {
      bio: currentUser?.profile?.bio || '',
      location: currentUser?.profile?.location || '',
      dateOfBirth: currentUser?.profile?.dateOfBirth || '',
      gender: currentUser?.profile?.gender || 'prefer-not-to-say',
      preferredLanguage: currentUser?.profile?.preferredLanguage || 'en',
      preferredCurrency: currentUser?.profile?.preferredCurrency || 'KES',
      timezone: currentUser?.profile?.timezone || 'Africa/Nairobi',
      profilePhoto: currentUser?.profile?.profilePhoto || '',
      notifications: {
        email: currentUser?.profile?.notifications?.email !== undefined 
          ? currentUser.profile.notifications.email 
          : true,
        sms: currentUser?.profile?.notifications?.sms !== undefined 
          ? currentUser.profile.notifications.sms 
          : true,
        push: currentUser?.profile?.notifications?.push !== undefined 
          ? currentUser.profile.notifications.push 
          : true
      }
    }
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    const loadUserData = () => {
      // First try to get from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUser(parsedProfile);
          if (parsedProfile.profile?.profilePhoto || parsedProfile.profilePhoto) {
            setPhotoPreview(parsedProfile.profile.profilePhoto || parsedProfile.profilePhoto);
          }
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing saved profile:', error);
          // If parsing fails, fall back to currentUser
        }
      }
      
      // Fall back to currentUser from context if no saved profile
      if (currentUser) {
        const userData = {
          id: currentUser._id || currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          profile: {
            bio: currentUser.profile?.bio || '',
            location: currentUser.profile?.location || '',
            dateOfBirth: currentUser.profile?.dateOfBirth || '',
            gender: currentUser.profile?.gender || 'prefer-not-to-say',
            preferredLanguage: currentUser.profile?.preferredLanguage || 'en',
            preferredCurrency: currentUser.profile?.preferredCurrency || 'KES',
            timezone: currentUser.profile?.timezone || 'Africa/Nairobi',
            profilePhoto: currentUser.profile?.profilePhoto || currentUser.profilePhoto || '',
            notifications: {
              email: currentUser.profile?.notifications?.email !== undefined ? currentUser.profile.notifications.email : true,
              sms: currentUser.profile?.notifications?.sms !== undefined ? currentUser.profile.notifications.sms : true,
              push: currentUser.profile?.notifications?.push !== undefined ? currentUser.profile.notifications.push : true
            },
            socialLinks: {
              facebook: currentUser.profile?.socialLinks?.facebook || '',
              twitter: currentUser.profile?.socialLinks?.twitter || '',
              linkedin: currentUser.profile?.socialLinks?.linkedin || '',
              instagram: currentUser.profile?.socialLinks?.instagram || ''
            }
          }
        };
        
        setUser(userData);
        if (userData.profile?.profilePhoto || userData.profilePhoto) {
          setPhotoPreview(userData.profile.profilePhoto || userData.profilePhoto);
        }
        
        // Update profile state with current user data
        if (currentUser.profile) {
          setProfile(prev => ({
            ...prev,
            ...currentUser.profile,
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || ''
          }));
        }
      }
    };
    
    loadUserData();
  }, [currentUser]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [profile, setProfile] = useState(defaultProfileState);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update profile data when user data changes
  useEffect(() => {
    let isMounted = true;
    
    const updateProfileFromUser = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        
        console.log('Updating profile with user data:', user); // Debug log
        
        // Create a normalized user object with all required fields
        const normalizedUser = {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          profilePhoto: user.profilePhoto || user.profile?.profilePhoto || '',
          bio: user.profile?.bio || '',
          location: user.profile?.location || '',
          dateOfBirth: user.profile?.dateOfBirth || '',
          gender: user.profile?.gender || 'prefer-not-to-say',
          preferredLanguage: user.profile?.preferredLanguage || 'en',
          preferredCurrency: user.profile?.preferredCurrency || 'KES',
          timezone: user.profile?.timezone || 'Africa/Nairobi',
          notifications: {
            email: user.profile?.notifications?.email !== undefined 
              ? user.profile.notifications.email 
              : true,
            sms: user.profile?.notifications?.sms !== undefined 
              ? user.profile.notifications.sms 
              : true,
            push: user.profile?.notifications?.push !== undefined 
              ? user.profile.notifications.push 
              : true
          },
          socialLinks: {
            facebook: user.profile?.socialLinks?.facebook || '',
            twitter: user.profile?.socialLinks?.twitter || '',
            linkedin: user.profile?.socialLinks?.linkedin || '',
            instagram: user.profile?.socialLinks?.instagram || ''
          }
        };
        
        console.log('Normalized profile data:', normalizedUser); // Debug log
        
        // Only update state if component is still mounted
        if (isMounted) {
          // Update the profile state
          setProfile(normalizedUser);
          
          // Set the photo preview if a profile photo exists
          if (normalizedUser.profilePhoto) {
            setPhotoPreview(normalizedUser.profilePhoto);
          }
          
          // Reset loading state and unsaved changes flag
          setIsLoading(false);
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.error('Error updating profile from user data:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    updateProfileFromUser();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [user, navigate, setProfile, setPhotoPreview, setIsLoading, setHasUnsavedChanges]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setProfile(prev => {
      // Handle nested objects (e.g., notifications.email, socialLinks.facebook)
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        };
      }
      
      // Handle regular fields
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
    });
    
    // Mark that there are unsaved changes
    setHasUnsavedChanges(true);
  }, []);

  const handleProfilePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset file input to allow selecting the same file again
    e.target.value = null;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Show loading state
    const toastId = toast.loading('Processing profile photo...');
    
    // Create a preview URL for the selected image
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const previewUrl = event.target.result;
      
      // Update the preview immediately
      setPhotoPreview(previewUrl);
      
      // Update the profile state with the new photo
      setProfile(prev => ({
        ...prev,
        profilePhoto: previewUrl
      }));
      
      // Store the file for saving
      setSelectedPhoto(file);
      
      // Mark that there are unsaved changes
      setHasUnsavedChanges(true);
      
      // Dismiss the loading toast
      toast.dismiss(toastId);
      
      // Show success message
      toast.success('Profile photo updated. Don\'t forget to save your changes!', {
        autoClose: 3000,
        closeButton: true,
      });
    };
    
    reader.onerror = () => {
      toast.update(toastId, {
        render: 'Failed to process the image. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      });
    };
    
    // Start reading the file
    reader.readAsDataURL(file);
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      navigate('/login', { state: { from: '/profile-settings' } });
      return;
    }

    setIsSaving(true);
    let toastId;
    
    try {
      // Show saving toast
      toastId = toast.loading('Saving profile changes...');
      
      // Prepare the updated profile data with proper structure
      const updatedUser = {
        // Top-level user fields
        id: user.id,
        name: profile.name.trim(),
        email: profile.email.trim().toLowerCase(),
        phone: profile.phone?.trim() || '',
        // Profile photo at root level for backward compatibility
        profilePhoto: photoPreview || user.profilePhoto || '',
        // Nested profile fields
        profile: {
          // Preserve existing profile data
          ...(user.profile || {}),
          // Update with new values
          bio: profile.bio?.trim() || '',
          location: profile.location?.trim() || '',
          dateOfBirth: profile.dateOfBirth || '',
          gender: profile.gender || 'prefer-not-to-say',
          preferredLanguage: profile.preferredLanguage || 'en',
          preferredCurrency: profile.preferredCurrency || 'KES',
          timezone: profile.timezone || 'Africa/Nairobi',
          lastUpdated: new Date().toISOString(),
          // Nested objects
          notifications: {
            ...(user.profile?.notifications || {}),
            email: !!profile.notifications?.email,
            sms: !!profile.notifications?.sms,
            push: !!profile.notifications?.push
          },
          socialLinks: {
            ...(user.profile?.socialLinks || {}),
            facebook: profile.socialLinks?.facebook?.trim() || '',
            twitter: profile.socialLinks?.twitter?.trim() || '',
            linkedin: profile.socialLinks?.linkedin?.trim() || '',
            instagram: profile.socialLinks?.instagram?.trim() || ''
          },
          // Ensure profile photo is set in the profile object as well
          profilePhoto: photoPreview || user.profile?.profilePhoto || ''
        }
      };
      
      // If a new photo was selected, convert it to base64
      if (selectedPhoto) {
        const photoUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(selectedPhoto);
        });
        
        updatedUser.profilePhoto = photoUrl;
        updatedUser.profile.profilePhoto = photoUrl;
        setSelectedPhoto(null);
        setPhotoPreview(photoUrl);
      }
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      
      // Update the user in the auth context
      await updateUser(updatedUser);
      
      // Update the local state
      setUser(updatedUser);
      setProfile(prev => ({
        ...prev,
        ...updatedUser,
        profilePhoto: updatedUser.profilePhoto || ''
      }));
      
      // Dismiss the loading toast
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      // Show success message
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      // Mark that there are no unsaved changes
      setHasUnsavedChanges(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Dismiss the loading toast if it exists
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      toast.error('Failed to update profile. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsSaving(false);
    }
  }, [user, profile, photoPreview, selectedPhoto, updateUser, navigate, setHasUnsavedChanges, setPhotoPreview, setSelectedPhoto, setUser, setProfile]);
  // Load user data when component mounts or user changes
  useEffect(() => {
    const loadUserData = () => {
      // First try to get from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          setUser(parsedProfile);
          if (parsedProfile.profile?.profilePhoto || parsedProfile.profilePhoto) {
            setPhotoPreview(parsedProfile.profile.profilePhoto || parsedProfile.profilePhoto);
          }
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing saved profile:', error);
          // If parsing fails, fall back to currentUser
        }
      }
      
      // Fall back to currentUser from context if no saved profile
      if (currentUser) {
        const userData = {
          id: currentUser._id || currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || '',
          profile: {
            bio: currentUser.profile?.bio || '',
            location: currentUser.profile?.location || '',
            dateOfBirth: currentUser.profile?.dateOfBirth || '',
            gender: currentUser.profile?.gender || 'prefer-not-to-say',
            preferredLanguage: currentUser.profile?.preferredLanguage || 'en',
            preferredCurrency: currentUser.profile?.preferredCurrency || 'KES',
            timezone: currentUser.profile?.timezone || 'Africa/Nairobi',
            profilePhoto: currentUser.profile?.profilePhoto || currentUser.profilePhoto || '',
            notifications: {
              email: currentUser.profile?.notifications?.email !== undefined ? currentUser.profile.notifications.email : true,
              sms: currentUser.profile?.notifications?.sms !== undefined ? currentUser.profile.notifications.sms : true,
              push: currentUser.profile?.notifications?.push !== undefined ? currentUser.profile.notifications.push : true
            },
            socialLinks: {
              facebook: currentUser.profile?.socialLinks?.facebook || '',
              twitter: currentUser.profile?.socialLinks?.twitter || '',
              linkedin: currentUser.profile?.socialLinks?.linkedin || '',
              instagram: currentUser.profile?.socialLinks?.instagram || ''
            }
          }
        };
        
        setUser(userData);
        if (userData.profile?.profilePhoto || userData.profilePhoto) {
          setPhotoPreview(userData.profile.profilePhoto || userData.profilePhoto);
        }
        
        // Update profile state with current user data
        if (currentUser.profile) {
          setProfile(prev => ({
            ...prev,
            ...currentUser.profile,
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || ''
          }));
        }
      }
    };
    
    loadUserData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20 flex items-center justify-center">
        <div className="text-center">
      </div>
    </div>
  );
}
  
if (!user) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
        <p className="text-gray-600 mb-6">You need to be logged in to view this page.</p>
        <button
          onClick={() => navigate('/login', { state: { from: '/profile-settings' } })}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-20">
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
          >
            <svg 
              className="w-5 h-5 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        </div>
        {hasUnsavedChanges && (
          <button
            onClick={handleSave}
            className={`inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="space-y-6">
          {/* Profile Photo */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Photo</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                    {profile.profilePhoto || photoPreview ? (
                      <img 
                        src={photoPreview || profile.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <Camera className="w-5 h-5 text-gray-700" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                  />
                </label>
              </div>
              <div className="text-sm text-gray-600">
                <p>Upload a photo in JPG, GIF or PNG format.</p>
                <p>Max file size 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline-block mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline-block mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline-block mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g. Nairobi, Kenya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline-block mr-2" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 inline-block mr-2" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Tell us a bit about yourself..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline-block mr-2" />
                  Language
                </label>
                <select
                  name="preferredLanguage"
                  value={profile.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="mr-1">KES</span>
                  Currency
                </label>
                <select
                  name="preferredCurrency"
                  value={profile.preferredCurrency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline-block mr-2" />
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={profile.timezone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Africa/Nairobi">Nairobi (GMT+3)</option>
                  <option value="Africa/Dar_es_Salaam">Dar es Salaam (GMT+3)</option>
                  <option value="Africa/Kampala">Kampala (GMT+3)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Receive important updates and notifications via email</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium transition-colors duration-200 ${!profile.notifications.email ? 'text-gray-500' : 'text-blue-600'}`}>
                    {profile.notifications.email ? 'ON' : 'OFF'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications.email"
                      checked={profile.notifications.email}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300">
                      <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-all duration-300 transform ${profile.notifications.email ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Get instant alerts via text message</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium transition-colors duration-200 ${!profile.notifications.sms ? 'text-gray-500' : 'text-blue-600'}`}>
                    {profile.notifications.sms ? 'ON' : 'OFF'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications.sms"
                      checked={profile.notifications.sms}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300">
                      <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-all duration-300 transform ${profile.notifications.sms ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">Push Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Get real-time updates on your device</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-medium transition-colors duration-200 ${!profile.notifications.push ? 'text-gray-500' : 'text-blue-600'}`}>
                    {profile.notifications.push ? 'ON' : 'OFF'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications.push"
                      checked={profile.notifications.push}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300">
                      <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-all duration-300 transform ${profile.notifications.push ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> You'll receive important account-related notifications regardless of these settings.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                  Facebook
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">facebook.com/</span>
                  </div>
                  <input
                    type="text"
                    name="socialLinks.facebook"
                    value={profile.socialLinks.facebook}
                    onChange={handleInputChange}
                    className="pl-28 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="username"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                  Twitter
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">twitter.com/</span>
                  </div>
                  <input
                    type="text"
                    name="socialLinks.twitter"
                    value={profile.socialLinks.twitter}
                    onChange={handleInputChange}
                    className="pl-28 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="username"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                  LinkedIn
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">linkedin.com/in/</span>
                  </div>
                  <input
                    type="text"
                    name="socialLinks.linkedin"
                    value={profile.socialLinks.linkedin}
                    onChange={handleInputChange}
                    className="pl-28 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="username"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                  Instagram
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">instagram.com/</span>
                  </div>
                  <input
                    type="text"
                    name="socialLinks.instagram"
                    value={profile.socialLinks.instagram}
                    onChange={handleInputChange}
                    className="pl-28 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
