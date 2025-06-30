import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
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

const SignIn = () => {
  const location = useLocation();
  
  const [formData, setFormData] = useState(() => {
    // Check for prefilled email from registration
    const prefilledEmail = location.state?.prefilledEmail || '';
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    
    // Use prefilled email from registration if available, otherwise use remembered email
    const email = prefilledEmail || rememberedEmail;
    const isAdminEmail = email === 'admin@chamaplus.com';
    
    return {
      email: email,
      password: '',
      rememberMe: !!rememberedEmail, // Only auto-check remember me if email was from localStorage
      userType: isAdminEmail ? 'admin' : 'member'
    };
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(() => {
    // Check for registration success message in location state
    if (location.state?.registrationSuccess) {
      return { 
        type: 'success', 
        message: location.state.message || 'Registration successful! Please log in.' 
      };
    }
    return { type: '', message: '' };
  });
  
  const navigate = useNavigate();
  const redirectInitiated = useRef(false);
  
  const { login, setCurrentUser } = useAuth();
  
  // Clear the location state after showing the message
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      // Replace the current entry in the history stack to clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    // Only update if the value has changed
    if (formData[name] === newValue) return;
    
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
    
    // Clear login status when user makes changes
    if (loginStatus.message) {
      setLoginStatus({ type: '', message: '' });
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle successful login
  const handleLoginSuccess = useCallback((result) => {
    if (redirectInitiated.current) return;
    
    // Mark redirect as initiated immediately to prevent multiple redirects
    redirectInitiated.current = true;
    
    // On successful login
    setLoginStatus({
      type: 'success',
      message: 'Login successful! Redirecting...'
    });
    
    // Always use the user type from the login result if available
    const userRole = result.user?.role || formData.userType;
    
    // Get the redirect path based on user role
    let redirectPath = '/';
    
    // Redirect based on user role
    if (userRole === 'admin') {
      console.log('Admin user detected, redirecting to admin dashboard');
      redirectPath = '/admin/dashboard';
    } 
    // For regular users, use the from path if it exists, otherwise go to dashboard
    else {
      const from = location.state?.from;
      redirectPath = from && from !== '/signin' ? from : '/dashboard';
      console.log('Regular user, redirecting to:', redirectPath);
    }
    
    // Use a minimal timeout to ensure state updates are processed
    const timer = setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.state?.from, navigate, formData.userType]);
  
  const handleSubmit = async (e) => {
    // Prevent default form submission
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    console.log('Form submission started');
    
    // Clear previous errors and status
    setErrors({});
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setLoginStatus({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Log the login attempt
      console.log('Attempting login with:', { 
        email: formData.email, 
        userType: formData.userType 
      });
      
      // Attempt to log in with rememberMe flag and user type
      const result = await login(
        formData.email, 
        formData.password, 
        formData.rememberMe,
        formData.userType
      );
      
      console.log('Login result:', result);
      
      if (result?.success) {
        // Check if the user's role matches the selected login type
        const userRole = result.user?.role?.toLowerCase();
        const selectedRole = formData.userType.toLowerCase();
        
        console.log('User role from server:', userRole);
        console.log('Selected role:', selectedRole);
        
        // Validate role match
        if (userRole !== selectedRole) {
          // Clear any stored tokens
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          
          // Clear auth header
          delete axios.defaults.headers.common['Authorization'];
          
          // Clear current user
          setCurrentUser(null);
          
          throw new Error(`Please use the ${userRole === 'admin' ? 'Admin' : 'Member'} login option to access your account.`);
        }
        
        // If roles match, proceed with login
        handleLoginSuccess(result);
      } else {
        // Handle API response errors
        const errorMessage = result?.message || 'Login failed. Please check your credentials and try again.';
        
        // Set field-specific errors if available
        if (result?.field) {
          setErrors(prev => ({
            ...prev,
            [result.field]: errorMessage
          }));
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (err.response) {
        // Server responded with an error status code
        errorMessage = err.response.data?.message || errorMessage;
        
        // Handle specific status codes
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.response.status === 403) {
          errorMessage = 'Access denied. Please check your account type and try again.';
        } else if (err.response.status === 404) {
          errorMessage = 'User not found. Please check your email or register for an account.';
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (err.message) {
        // Other errors
        errorMessage = err.message;
      }
      
      setLoginStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { logout } = useAuth();

  // Clear any existing authentication state on component mount
  useEffect(() => {
    // Only clear auth state if we're not already on the sign-in page
    const clearAuth = async () => {
      try {
        // Only logout if we have a token (user is logged in)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          console.log('Clearing existing auth state...');
          await logout();
        }
        // Clear any existing error messages
        setLoginStatus(prev => prev.type ? { type: '', message: '' } : prev);
        setErrors(prev => (Object.keys(prev).length ? {} : prev));
      } catch (error) {
        console.error('Error during auth cleanup:', error);
      }
    };
    
    clearAuth();
    
    // Clean up function to prevent memory leaks
    return () => {
      // Any cleanup if needed
    };
  }, [logout]);

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
                    <FiMail className="h-6 w-6 text-white" />
                  </div>
                  <span className="ml-2 text-2xl font-bold text-gray-800">ChamaPlus</span>
                </div>
              </Link>
              <h1 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h1>
              <p className="mt-1 text-sm text-gray-500">Sign in to your ChamaPlus account</p>
            </div>

            {/* Status Messages */}
            {loginStatus.message && (
              <div 
                className={`mb-6 p-4 rounded-lg ${
                  loginStatus.type === 'error' 
                    ? 'bg-red-50 border-l-4 border-red-500' 
                    : 'bg-green-50 border-l-4 border-green-500'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className={`h-5 w-5 ${
                      loginStatus.type === 'error' ? 'text-red-500' : 'text-green-500'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${
                      loginStatus.type === 'error' ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {loginStatus.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* User Type Toggle */}
              <div className="flex rounded-md shadow-sm bg-gray-100 p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'admin' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-150 ${
                    formData.userType === 'admin'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'member' }))}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-150 ${
                    formData.userType === 'member'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Member Login
                </button>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
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
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? inputErrorClasses : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="mt-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? inputErrorClasses : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Remember Me & Submit Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in as {formData.userType}...
                    </>
                  ) : (
                    `Sign in as ${formData.userType === 'admin' ? 'Admin' : 'Member'}`
                  )}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500"
                  state={{ userType: formData.userType }}
                >
                  Sign up as {formData.userType}
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Dynamic Content Based on User Type */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
            {formData.userType === 'admin' ? (
              // Admin Login Content
              <>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome Back, Admin</h2>
                  <p className="mt-2 text-blue-100">
                    Access your chama management dashboard and oversee all operations.
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
                      <p className="text-base font-medium text-white">Complete Oversight</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Monitor all chama activities, from contributions to loan approvals and member management.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Advanced Analytics</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Access detailed reports and insights about your chama's financial health and growth.
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
                      <p className="text-base font-medium text-white">Secure Administration</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Enterprise-grade security to protect your chama's sensitive financial data and member information.
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
                      <p className="text-xs font-medium text-blue-200">ChamaPlus Admin</p>
                    </div>
                  </div>
                  <blockquote className="mt-4">
                    <p className="text-base text-blue-100">
                      "ChamaPlus has transformed how we manage our chama. The admin tools save us hours of work every week."
                    </p>
                  </blockquote>
                </div>
              </>
            ) : (
              // Member Login Content
              <>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome Back, Member</h2>
                  <p className="mt-2 text-blue-100">
                    Access your personal chama dashboard and stay connected with your group.
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
                        Keep up with your chama's latest activities, meetings, and group announcements.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">Track Your Contributions</p>
                      <p className="mt-1 text-sm text-blue-100">
                        Monitor your savings, loan status, and investment portfolio in one convenient place.
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
                      "I love how easy it is to track my contributions and see how my chama is growing. The app is a game-changer!"
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

export default SignIn;
