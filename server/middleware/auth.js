// server/middleware/auth.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Verify JWT token
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }
    req.user = user; // Attach full user object to request
    next();
  } catch (error) {
    console.error('Authentication check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if user is loan officer
exports.isLoanOfficer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || !['ADMIN', 'LOAN_OFFICER'].includes(user.role)) {
      return res.status(403).json({ error: 'Access denied. Loan officer privileges required.' });
    }
    
    next();
  } catch (error) {
    console.error('Loan officer check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if user has completed profile
exports.hasCompleteProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.profileStatus !== 'complete') {
      return res.status(403).json({ error: 'Please complete your profile first.' });
    }
    
    next();
  } catch (error) {
    console.error('Profile check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check if user has verified KYC
exports.hasVerifiedKYC = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user || user.kycStatus !== 'verified') {
      return res.status(403).json({ error: 'KYC verification required.' });
    }
    
    next();
  } catch (error) {
    console.error('KYC check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Combine multiple auth checks
exports.checkUserAccess = (...middlewares) => {
  return async (req, res, next) => {
    try {
      for (let middleware of middlewares) {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            resolve();
          });
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};