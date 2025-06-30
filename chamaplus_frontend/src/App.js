import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkBackendHealth } from './services/healthService';

// Components
import AppHeader from './components/AppHeader';
import AdminHeader from './components/AdminHeader';
import Sidebar from './components/Sidebar';
import AdminSidebar from './components/AdminSidebar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import MyChamasPage from './pages/MyChamasPage';
import ContributionsPage from './pages/ContributionsPage';
import AdminContributionsPage from './pages/AdminContributionsPage';
import ReportsPage from './pages/ReportsPage';
import LoansPage from './pages/LoansPage';
import MeetingsPage from './pages/MeetingsPage';
import SettingsPage from './pages/SettingsPage';
import ChamaDetailsPage from './pages/ChamaDetailsPage';
import LoanDetailsPage from './pages/LoanDetailsPage';
import MeetingDetailsPage from './pages/MeetingDetailsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ChamaStatisticsPage from './pages/ChamaStatisticsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ChamaAdminDashboardPage from './pages/ChamaAdminDashboardPage';
import AdminChamasPage from './pages/admin/AdminChamasPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminMeetingsPage from './pages/admin/AdminMeetingsPage';
import AdminLoansPage from './pages/admin/AdminLoansPage';
import AdminLoanDetailsPage from './pages/admin/AdminLoanDetailsPage';
import CreateChamaPage from './pages/admin/CreateChamaPage';
import AdminReportsPage from './pages/AdminReportsPage';

// Create and export auth context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Add debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('useAuth context:', {
      currentUser: context.currentUser,
      isAuthenticated: context.isAuthenticated,
      isAdmin: context.isAdmin,
      isMember: context.isMember,
      loading: context.loading
    });
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    let isMounted = true;
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token) {
      // Set up axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // If we have a stored user, use it immediately for faster initial render
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          console.log('Loaded user from storage:', user);
          console.log('User role from storage:', user.role);
          if (isMounted) {
            setCurrentUser(user);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
      
      // Always fetch fresh user data in the background
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/me');
          if (isMounted && response.data) {
            // Extract user data from response
            const userData = response.data.data || response.data;
            
            // Update stored user data
            if (localStorage.getItem('token')) {
              localStorage.setItem('user', JSON.stringify(userData));
            } else if (sessionStorage.getItem('token')) {
              sessionStorage.setItem('user', JSON.stringify(userData));
            }
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (isMounted) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            setCurrentUser(null);
            // Navigate to login on auth error
            navigate('/signin');
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      
      fetchUser();
    } else if (isMounted) {
      setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [navigate]); // Keep navigate in dependencies since we're using it in the effect

  // Update user data in context and storage

  // Login function
  const login = useCallback(async (email, password, rememberMe = false, userType = 'member') => {
    try {
      console.log('Attempting to log in with email:', email);
      
      // Clear any existing auth headers to prevent conflicts
      delete axios.defaults.headers.common['Authorization'];
      
      // Normal login flow with userType for role-based auth
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email.trim().toLowerCase(),
        password: password,
        userType: userType // Send the selected user type to the server
      }, {
        validateStatus: (status) => status >= 200 && status < 500 // Accept all status codes < 500
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response data:', response.data);
      
      // Extract user data from response
      const responseData = response.data;
      const user = responseData.user || responseData.data?.user || responseData;
      const token = responseData.token;
      
      console.log('Extracted user:', user);
      console.log('User role from response:', user?.role);

      // Handle successful login
      if (response.status === 200 && token && user) {
        // Verify the user's role matches the selected user type
        if (user.role && user.role.toLowerCase() !== userType.toLowerCase()) {
          // Clear any stored tokens
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          
          throw new Error(`Please use the ${user.role} login option to access your account.`);
        }
        // Store token and user data in localStorage if remember me is checked, otherwise use sessionStorage
        if (rememberMe) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } else {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(user));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
        
        // Set auth header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Set current user in context
        setCurrentUser(user);
        
        // Return success with user data
        return { 
          success: true,
          user,
          token
        };
      } else {
        // Handle non-200 responses
        console.error('Login failed with status:', response.status);
        const errorMessage = response.data?.message || 'Invalid email or password';
        
        // Clear any existing tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        
        // Return error with message
        return { 
          success: false, 
          message: errorMessage,
          status: response.status
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'An unexpected error occurred during login. Please try again.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        
        // Handle specific error statuses
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied. Please check your account type and try again.';
        } else if (error.response.status === 404) {
          errorMessage = 'User not found. Please check your email or register for an account.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        errorMessage = `Login failed: ${error.message}`;
      }
      // Clear any existing tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      // Return error with message
      return { 
        success: false, 
        message: errorMessage,
        error: error.message
      };
    }
  }, []); // No dependencies needed as we're not using any external values

  // Register function
  const register = useCallback(async (userData) => {
    try {
      // For test user registration
      if (userData.email === 'admin@chamaplus.com') {
        const testUser = {
          _id: 'test-user-id',
          name: userData.name || 'Test Admin',
          email: 'admin@chamaplus.com',
          role: userData.role || 'admin'
        };
        
        const testToken = 'test-token-123456';
        
        localStorage.setItem('token', testToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${testToken}`;
        setCurrentUser(testUser);
        return { success: true };
      }
      
      // Normal registration flow
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      // Auto-login after registration
      if (response.data.token) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCurrentUser(user);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  }, [setCurrentUser]); // Remove axios from dependencies as it's not needed

  // Logout function
  const logout = useCallback(() => {
    // Clear all auth data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset current user
    setCurrentUser(null);
    
    // The actual navigation will be handled by the component that calls logout
    // This ensures we don't have race conditions with React Router
    
    return true;
  }, [setCurrentUser]);

  // Update user data
  const updateUser = useCallback(async (userData) => {
    try {
      // If we're updating with a complete user object
      if (userData && typeof userData === 'object' && !userData.id) {
        setCurrentUser(prev => ({
          ...prev,
          ...userData
        }));
        return { success: true, user: { ...currentUser, ...userData } };
      }
      
      // If we need to fetch fresh data from the server
      const response = await axios.get('http://localhost:5000/api/users/me');
      if (response.data) {
        setCurrentUser(response.data);
        return { success: true, user: response.data };
      }
      
      return { success: false, message: 'Failed to update user data' };
    } catch (error) {
      console.error('Error updating user data:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update user data' 
      };
    }
  }, [currentUser, setCurrentUser]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isMember: currentUser?.role === 'member' || currentUser?.role === 'admin' // Admins can access member routes
  }), [currentUser, loading, login, register, logout, updateUser]);

  // Log the context value for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthProvider context updated:', {
        currentUser: currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        isMember: currentUser?.role === 'member' || currentUser?.role === 'admin',
        loading: loading
      });
    }
  }, [currentUser, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// ProtectedRoute component
const ProtectedRoute = ({ children, adminOnly = false, memberOnly = false }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // If we're still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Debug log
  console.log('ProtectedRoute - Current User:', currentUser);
  console.log('ProtectedRoute - Checking access for:', { adminOnly, memberOnly });

  // If there's no current user, redirect to login
  if (!currentUser) {
    console.log('No current user, redirecting to signin');
    const redirectTo = location.pathname !== '/signin' ? location.pathname + location.search : '/';
    return <Navigate to="/signin" state={{ from: redirectTo }} replace />;
  }

  // Get user object from response if it's nested in data property
  const user = currentUser.data || currentUser;
  
  // Get user role (ensure it's a string and lowercase for comparison)
  const userRole = typeof user.role === 'string' ? user.role.toLowerCase() : '';
  
  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - User role:', userRole, 'Admin only:', adminOnly, 'Member only:', memberOnly);
  
  // If route requires admin access and user is not an admin
  if (adminOnly && userRole !== 'admin') {
    console.warn('Unauthorized access attempt to admin route. User role:', userRole);
    // Redirect to dashboard with error message
    return <Navigate to="/dashboard?error=unauthorized" replace state={{ from: location.pathname }} />;
  }

  // Block admin access to member-only routes
  if (memberOnly && userRole === 'admin') {
    console.warn('Blocked admin access to member-only route');
    // Redirect to admin dashboard with unauthorized message
    return <Navigate to="/admin/dashboard?error=unauthorized" replace />;
  }

  // If user is authenticated and has the required role, render the children
  return children;
};

// App layout component
export const AppLayout = ({ children, isMobile, sidebarMinimized, setSidebarMinimized, sidebarOpen, setSidebarOpen, isAdminRoute = false }) => {
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminPath = location.pathname.startsWith('/admin');
  
  return (
    <div className={`min-h-screen ${isAdminPath ? 'bg-gray-100' : 'bg-gray-50'}`}>
      {isAdminPath ? (
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
      ) : (
        <AppHeader 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />
      )}
      <div className="flex pt-16">
        {isAdminPath ? (
          <AdminSidebar 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            onToggle={setSidebarOpen}
          />
        ) : (
          <Sidebar 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            onToggle={setSidebarOpen}
          />
        )}
        <main 
          className={`flex-1 transition-all duration-200 ${
            isMobile 
              ? 'ml-0' 
              : sidebarMinimized 
                ? 'ml-20' 
                : isAdminPath 
                  ? 'ml-64' 
                  : 'ml-56'
          }`}
        >
          <div className={`p-4 md:p-8 ${isAdminPath ? 'max-w-7xl mx-auto' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Main App component
const ChamaPlusApp = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    status: 'checking',
    lastChecked: null,
    error: null
  });

  // Check backend health on app load
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await checkBackendHealth();
        setBackendStatus({
          status: health.status === 'success' ? 'online' : 'error',
          lastChecked: new Date().toISOString(),
          error: health.status === 'error' ? health.message : null
        });
      } catch (error) {
        console.error('Health check failed:', error);
        setBackendStatus({
          status: 'error',
          lastChecked: new Date().toISOString(),
          error: error.message
        });
      }
    };

    checkHealth();
    // Check every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const [loans, setLoans] = useState([
    {
      id: "1",
      member: "John Doe",
      amount: 50000,
      status: "active",
      dateIssued: "2025-05-01",
      dueDate: "2025-11-01",
      interestRate: 10,
      purpose: "Business expansion",
      payments: [
        { date: "2025-06-01", amount: 10000 },
        { date: "2025-07-01", amount: 10000 }
      ]
    },
    // Add more sample loans as needed
  ]);
  const { currentUser: authUser } = useAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close sidebar on mobile when resizing to mobile
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root route redirects to appropriate dashboard based on user role */}
      <Route path="/" element={
        !authUser ? (
          <LandingPage />
        ) : (
          <Navigate to={authUser.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
        )
      } />
      <Route path="/signin" element={
        !authUser ? (
          <SignIn />
        ) : (
          <Navigate to={authUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
        )
      } />
      <Route path="/register" element={
        !authUser ? (
          <Register />
        ) : (
          <Navigate to={authUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
        )
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ChamaAdminDashboardPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/contributions" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isAdminRoute={true}
          >
            <AdminContributionsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/chamas" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <AdminChamasPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/chamas/new" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <CreateChamaPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/members" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <AdminMembersPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/meetings" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <AdminMeetingsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/loans" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <AdminLoansPage loans={loans} setLoans={setLoans} />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/loans/:id" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <AdminLoanDetailsPage loans={loans} setLoans={setLoans} />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/meetings/:id" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <MeetingDetailsPage isAdmin={true} />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/reports" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isAdminRoute={true}
          >
            <AdminReportsPage 
              isMobile={isMobile}
              sidebarMinimized={sidebarMinimized}
              setSidebarMinimized={setSidebarMinimized}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Member Routes */}
      
      <Route path="/dashboard" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <DashboardPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/my-chamas" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <MyChamasPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/chamas/:id" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ChamaDetailsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/contributions" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ContributionsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/loans" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <LoansPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/loans/:id" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <LoanDetailsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/meetings" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <MeetingsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/meetings/:id" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <MeetingDetailsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ReportsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/activities" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ActivitiesPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/statistics" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ChamaStatisticsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <SettingsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute memberOnly={true}>
          <AppLayout 
            isMobile={isMobile}
            sidebarMinimized={sidebarMinimized}
            setSidebarMinimized={setSidebarMinimized}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          >
            <ProfileSettingsPage />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default ChamaPlusApp;
