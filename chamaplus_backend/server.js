import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chamaRoutes from './routes/chamaRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import adminMeetingRoutes from './routes/adminMeetingRoutes.js';

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Load environment variables
dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      // Development
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      
      // Production - Vercel
      'https://chamaplus.vercel.app',
      'https://www.chamaplus.vercel.app',
      'https://chamaplus-frontend.vercel.app',
      'https://chamaplus-frontend-*.vercel.app',
      'https://chamaplus-frontend-git-main-vincent-ojiambos-projects.vercel.app',
      'https://chamaplus-frontend-rd28ncafg-vincent-ojiambos-projects.vercel.app',
      'https://chamaplus-frontend-hwm52exlo-vincent-ojiambos-projects.vercel.app'
    ];
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      allowedOrigin.includes('*') && 
      new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$').test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token',
    'X-Requested-With'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Apply CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: corsOptions,
  path: '/socket.io/'
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Log the origin of the connection
  const origin = socket.handshake.headers.origin || 'unknown';
  console.log(`Socket connection from origin: ${origin}`);
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Simple logger to show requests are reaching the backend
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://Vincent:Vincent@cluster0.poind9k.mongodb.net/chamaplus", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Backend is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount all routes
const routes = [
  { path: '/api/auth', router: authRoutes },
  { path: '/api/users', router: userRoutes },
  { path: '/api/notifications', router: notificationRoutes },
  { path: '/api/chamas', router: chamaRoutes },
  { path: '/api/loans', router: loanRoutes },
  { path: '/api/admin/meetings', router: adminMeetingRoutes }
];

routes.forEach(route => {
  app.use(route.path, route.router);
  console.log(`Mounted routes for ${route.path}`);
});

console.log('All routes mounted successfully');

// Root route
app.get("/", (req, res) => {
  res.send("ChamaPlus Backend is running!");
});

// API 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// General 404 handler
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).send('Page not found');
  } else if (req.accepts('json')) {
    res.status(404).json({ success: false, message: 'Resource not found' });
  } else {
    res.status(404).type('txt').send('Not found');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log('WebSocket server is running');
});
