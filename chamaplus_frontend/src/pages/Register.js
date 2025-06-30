import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// No need to import useAuth since we're not using it anymore
import { FiMail, FiLock, FiUser, FiPhone, FiUsers, FiCalendar, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import zxcvbn from 'zxcvbn';
import axios from 'axios';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const inputErrorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
const inputValidClasses = 'border-green-500 focus:ring-green-500 focus:border-green-500';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nationality: 'Kenyan',
    role: 'member',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({ type: '', message: '' });
  const [passwordScore, setPasswordScore] = useState(0);
  
  const navigate = useNavigate();
  // No need for login function since we're redirecting to signin
  
  // Get role from URL query parameter
  const [searchParams] = useSearchParams();
  
  // Set role from URL query parameter on component mount
  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'admin' || role === 'member') {
      setFormData(prev => ({
        ...prev,
        role
      }));
    }
  }, [searchParams]);
  
  const validateForm = () => {
    const newErrors = {};
    const passwordMinLength = 8;
    
    // Name validation (required)
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    // Email validation (required)
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Email must be less than 255 characters';
    }
    
    // Phone validation (optional but recommended)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      } else if (formData.phone.length > 20) {
        newErrors.phone = 'Phone number is too long';
      }
    }
    
    // Password validation (required)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < passwordMinLength) {
      newErrors.password = `Password must be at least ${passwordMinLength} characters`;
    } else if (passwordScore < 1) { // Reduced strictness from 2 to 1
      newErrors.password = 'Password is too weak. Try adding more complexity';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long';
    }
    
    // Confirm password validation (required)
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms and conditions (required)
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    // Address/Chama Name validation (required for admin, optional for members)
    if (formData.role === 'admin' && (!formData.address || !formData.address.trim())) {
      newErrors.address = 'Chama Name is required for admin users';
    } else if (formData.role === 'admin' && formData.address) {
      if (formData.address.trim().length < 3) {
        newErrors.address = 'Chama Name must be at least 3 characters';
      } else if (formData.address.trim().length > 100) {
        newErrors.address = 'Chama Name must be less than 100 characters';
      }
    }
    
    // Set errors and return validation result
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    if (!isValid) {
      // Scroll to the first error
      const firstError = Object.keys(newErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    return isValid;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Update password strength
    if (name === 'password') {
      const result = zxcvbn(newValue);
      setPasswordScore(result.score);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }
    
    setIsSubmitting(true);
    setRegistrationStatus({ type: 'info', message: 'Creating your account...' });
    
    try {
      // Prepare user data for registration
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Add confirmPassword
        phone: formData.phone ? formData.phone.trim() : '', // Ensure phone is always included
        role: formData.role,
        nationality: formData.nationality || 'Kenyan', // Default to Kenyan if not provided
        dateOfBirth: formData.dateOfBirth || null,
        // Only include address if it's provided or if user is admin
        ...(formData.role === 'admin' || formData.address ? { 
          address: formData.address?.trim() || '' 
        } : {})
      };
      
      console.log('Submitting registration with data:', userData);
      
      // Register user using axios for better error handling
      const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status < 500, // Reject only if status is 500 or higher
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed. Please check your information and try again.');
      }
      
      // After successful registration, redirect to login with email prefilled
      setRegistrationStatus({
        type: 'success',
        message: 'Registration successful! Redirecting to login...'
      });
      
      // Redirect to signin page with email prefilled
      setTimeout(() => {
        navigate('/signin', { 
          state: { 
            registrationSuccess: true,
            prefilledEmail: formData.email,
            message: 'Registration successful! Please log in with your new account.'
          }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with an error status code
        errorMessage = error.response.data?.message || errorMessage;
        
        // Handle specific error cases
        if (error.response.status === 409) {
          errorMessage = 'An account with this email already exists. Please use a different email or sign in.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid registration data. Please check your information and try again.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message) {
        // Other errors
        errorMessage = error.message;
      }
      
      setRegistrationStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <motion.div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="md:flex">
          {/* Left Side - Form */}
          <div className="w-full md:w-1/2 p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <div className="flex items-center justify-center">
                  <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-2 text-2xl font-bold text-gray-800">ChamaPlus</span>
                </div>
              </Link>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="mt-1 text-sm text-gray-500">Join ChamaPlus today and manage your chama with ease</p>
            </div>

            {/* Status Messages */}
            {registrationStatus.message && (
              <div 
                className={`mb-6 p-4 rounded-lg ${
                  registrationStatus.type === 'error' 
                    ? 'bg-red-50 border-l-4 border-red-500' 
                    : 'bg-green-50 border-l-4 border-green-500'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {registrationStatus.type === 'error' ? (
                      <FiAlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    ) : (
                      <FiAlertCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p 
                      className={`text-sm ${
                        registrationStatus.type === 'error' ? 'text-red-700' : 'text-green-700'
                      }`}
                    >
                      {registrationStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="flex rounded-md shadow-sm bg-gray-100 p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'member' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-150 ${
                    formData.role === 'member' 
                      ? 'bg-white text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  As a Member
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-150 ${
                    formData.role === 'admin' 
                      ? 'bg-white text-blue-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  As a Chama Admin
                </button>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name {errors.name && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.name
                        ? inputErrorClasses
                        : formData.name && !errors.name
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 py-2 px-3`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : ''}
                    required
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address {errors.email && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.email
                        ? inputErrorClasses
                        : formData.email && !errors.email
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 py-2 px-3`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : ''}
                    required
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.phone
                        ? inputErrorClasses
                        : formData.phone && !errors.phone
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 py-2 px-3`}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : ''}
                    placeholder="+254 700 000000"
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password {errors.password && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.password
                        ? inputErrorClasses
                        : formData.password && !errors.password
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 pr-10 py-2`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password {errors.confirmPassword && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.confirmPassword
                        ? inputErrorClasses
                        : formData.confirmPassword && !errors.confirmPassword
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 pr-10 py-2`}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Chama Name - Only show for admin */}
              {formData.role === 'admin' && (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Chama Name {formData.role === 'admin' && <span className="text-red-500">*</span>}
                  {formData.role === 'admin' && <span className="text-xs text-gray-500 ml-1">(Required for admin)</span>}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your chama name"
                    value={formData.address}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.address
                        ? inputErrorClasses
                        : formData.address && !errors.address
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 py-2 px-3`}
                    aria-invalid={!!errors.address}
                    aria-describedby={errors.address ? 'address-error' : ''}
                  />
                </div>
                {errors.address && (
                  <p id="address-error" className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              )}

              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.dateOfBirth
                        ? inputErrorClasses
                        : formData.dateOfBirth && !errors.dateOfBirth
                          ? inputValidClasses
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } shadow-sm sm:text-sm pl-10 py-2 px-3`}
                    aria-invalid={!!errors.dateOfBirth}
                    aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : ''}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.dateOfBirth && (
                  <p id="dateOfBirth-error" className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Nationality */}
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="Kenyan">Kenyan</option>
                  <option value="Ugandan">Ugandan</option>
                  <option value="Tanzanian">Tanzanian</option>
                  <option value="Rwandan">Rwandan</option>
                  <option value="Burundian">Burundian</option>
                  <option value="South Sudanese">South Sudanese</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </a>
                    {errors.acceptTerms && (
                      <span className="block mt-1 text-red-600">
                        {errors.acceptTerms}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? 'bg-blue-400'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  } transition duration-150 ease-in-out`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/signin" 
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Dynamic Content Based on Role */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
            {formData.role === 'admin' ? (
              // Admin Registration Content
              <>
                <div>
                  <h2 className="text-2xl font-bold text-white">Start Your Chama Management Journey</h2>
                  <p className="mt-2 text-blue-100">
                    Create your admin account and take control of your chama's financial management.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Complete Chama Control</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Manage members, track contributions, approve loans, and generate reports all in one place.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Real-time Financial Tracking</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Monitor your chama's financial health with up-to-date dashboards and reports.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Secure & Compliant</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Bank-level security and compliance to protect your chama's sensitive financial data.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        JM
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">James Mwangi</p>
                      <p className="text-xs font-medium text-blue-200">ChamaPlus Admin User</p>
                    </div>
                  </div>
                  <blockquote className="mt-4">
                    <p className="text-base text-blue-100">
                      "Since using ChamaPlus, our administrative workload has decreased by 60%, and our members love the transparency."
                    </p>
                  </blockquote>
                </div>
              </>
            ) : (
              // Member Registration Content
              <>
                <div>
                  <h2 className="text-2xl font-bold text-white">Join Your Chama Community</h2>
                  <p className="mt-2 text-blue-100">
                    Create your member account and stay connected with your chama's activities.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Stay Connected</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Keep up with your chama's activities, meetings, and announcements in real-time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Track Your Contributions</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Easily view your contribution history and loan status at any time.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Secure & Private</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Your personal and financial information is protected with bank-level security.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                        SN
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">Sarah Njoroge</p>
                      <p className="text-xs font-medium text-blue-200">ChamaPlus Member</p>
                    </div>
                  </div>
                  <blockquote className="mt-4">
                    <p className="text-base text-blue-100">
                      "The ChamaPlus app makes it so easy to track my contributions and stay updated on our chama's progress."
                    </p>
                  </blockquote>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
