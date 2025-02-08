// server/routes/user.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { validateProfileUpdate } = require('../middleware/validation');

// Verify imports
console.log('validateProfileUpdate:', !!validateProfileUpdate);
console.log('userController.updateProfile:', !!userController.updateProfile);

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', validateProfileUpdate, userController.updateProfile);

// Delete user account
router.delete('/profile', userController.deleteProfile);

module.exports = router;