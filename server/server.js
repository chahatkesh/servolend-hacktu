require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const path = require('path');
const fs = require('fs').promises;

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// Connect to MongoDB
connectDB();

// Create upload directories if they don't exist
const createUploadDirs = async () => {
  const dirs = ['uploads/temp', 'uploads/documents'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(path.join(__dirname, dir), { recursive: true });
      console.log(`Directory created: ${dir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`Error creating directory ${dir}:`, error);
      }
    }
  }
};
createUploadDirs();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Initialize Passport
app.use(passport.initialize());

// Serve static files from uploads directory with proper security headers
app.use('/uploads', (req, res, next) => {
  // Add security headers
  res.set({
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  // Set Cache-Control header
  maxAge: '1d',
  // Only allow specific file types
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.pdf') {
      res.set('Content-Type', 'application/pdf');
    }
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Handle file upload errors
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File size limit exceeded',
      details: 'Maximum file size is 10MB'
    });
  }

  if (err.code === 'LIMIT_FILE_TYPE') {
    return res.status(400).json({
      error: 'Invalid file type',
      details: 'Only PDF, JPG, and PNG files are allowed'
    });
  }

  next(err);
});

// General error handling middleware
app.use((err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Clean up any uploaded files if there was an error
  if (req.file) {
    fs.unlink(req.file.path).catch(console.error);
  }

  // Send error response
  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', process.env.CLIENT_URL);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Log the error and cleanly shut down the server
  server.close(() => {
    throw new Error('Server shutdown due to uncaught exception: ' + err.message);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log the error and cleanly shut down the server
  server.close(() => {
    throw new Error('Server shutdown due to unhandled rejection: ' + reason);
  });
});

app.use((err, req, res, next) => {
  if (err.code === 'ENOENT') {
    return res.status(404).json({
      error: 'File not found',
      details: 'The requested document could not be found on the server'
    });
  }

  if (err.code === 'EACCES') {
    return res.status(403).json({
      error: 'Access denied',
      details: 'Permission denied to access the requested document'
    });
  }

  next(err);
});