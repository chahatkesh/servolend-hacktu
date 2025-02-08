const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { validateGoogleToken } = require('../middleware/validation');

// Google OAuth routes
router.post('/google', validateGoogleToken, authController.googleAuth);

// Logout route
router.post('/logout', authController.logout);

// Check authentication status
router.get('/status',
  passport.authenticate('jwt', { session: false }),
  authController.checkAuth
);

module.exports = router;