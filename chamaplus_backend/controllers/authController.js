import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Ensure JWT secret is set
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    // Extract and validate required fields
    const { 
      name, 
      email, 
      password, 
      confirmPassword,
      phone, 
      address, 
      dateOfBirth, 
      nationality = 'Kenyan',
      role = 'member' 
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
        requiredFields: ['name', 'email', 'password', 'confirmPassword']
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        field: 'email'
      });
    }

    // Validate role if provided
    if (role && !['member', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
        validRoles: ['member', 'admin']
      });
    }

    // Prepare user data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by the pre-save hook
      role: role.toLowerCase(),
      isActive: true,
      lastLogin: new Date()
    };

    // Add optional fields if provided
    if (phone) userData.phone = phone.trim();
    if (address) userData.address = address.trim();
    if (dateOfBirth) userData.dateOfBirth = new Date(dateOfBirth);
    if (nationality) userData.nationality = nationality.trim();

    // Create new user
    const user = await User.create(userData);

    // Generate JWT token
    const token = generateToken(user._id, user.role);
    
    // Prepare user response (exclude sensitive data)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      nationality: user.nationality,
      dateOfBirth: user.dateOfBirth,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    };

    // Send verification email (placeholder for actual email sending)
    try {
      // TODO: Implement email verification
      console.log(`Verification email would be sent to: ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue registration even if email sending fails
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: userResponse,
      token,
      // Include this only in development
      ...(process.env.NODE_ENV === 'development' && { 
        debug: { 
          verificationRequired: true,
          emailSent: false // Would be true in production after implementing email
        } 
      })
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors (e.g., duplicate email)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        field: 'email'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack 
      })
    });
  }
};

// Generate JWT Token
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(
    { 
      id: id.toString(), // Ensure ID is a string
      role,
      iat: Math.floor(Date.now() / 1000) // Issued at time
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '30d',
      algorithm: 'HS256'
    }
  );
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email, userType: req.body.userType });
    
    const { email, password, userType } = req.body;

    // Validate request
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password',
        field: !email ? 'email' : 'password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password',
        field: 'email'
      });
    }

    // Check if the provided userType matches the user's role (if userType is provided)
    if (userType && user.role !== userType) {
      console.log(`Login failed: User role ${user.role} doesn't match requested type ${userType}`);
      return res.status(403).json({ 
        success: false,
        message: `Access denied. This account doesn't have ${userType} privileges.`,
        field: 'userType'
      });
    }
    
    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
        field: 'email'
      });
    }

    // Check password using the model method
    console.log('Comparing passwords...');
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    console.log('Password match successful, generating token...');
    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Update last login time
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Return user data and token (excluding password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      lastLogin: user.lastLogin
    };

    console.log('Login successful for user:', userResponse.email);
    res.status(200).json({
      success: true,
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id, updatedUser.role),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
