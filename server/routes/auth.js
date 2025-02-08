// server/routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { validateGoogleToken } = require('../middleware/validation');
const { googleAuth, logout, checkAuth } = require('../controllers/authController');

// Verify imports are working
console.log('validateGoogleToken:', !!validateGoogleToken);
console.log('googleAuth:', !!googleAuth);

// Google OAuth route
router.post('/google', validateGoogleToken, googleAuth);

// Logout route
router.post('/logout', logout);

// Check authentication status
router.get('/status',
  passport.authenticate('jwt', { session: false }),
  checkAuth
);

module.exports = router;