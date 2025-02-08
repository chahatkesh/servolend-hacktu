// server/routes/loanApplication.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const loanApplicationController = require('../controllers/LoanApplicationController');
const { isAdmin, isLoanOfficer } = require('../middleware/auth');

// Middleware to check if user is authenticated
const auth = passport.authenticate('jwt', { session: false });

// User routes
router.get('/applications', 
  auth, 
  loanApplicationController.getUserApplications
);

router.post('/applications', 
  auth, 
  loanApplicationController.createApplication
);

router.get('/applications/:id', 
  auth, 
  loanApplicationController.getApplicationById
);

router.put('/applications/:id', 
  auth, 
  loanApplicationController.updateApplication
);

router.post('/applications/:id/submit', 
  auth, 
  loanApplicationController.submitApplication
);

// Admin routes
router.get('/admin/applications', 
  auth, 
  isAdmin, 
  loanApplicationController.getAllApplications
);

router.put('/admin/applications/:id/status', 
  auth, 
  isAdmin, 
  loanApplicationController.updateApplicationStatus
);

router.put('/admin/applications/:id/assign', 
  auth, 
  isAdmin, 
  loanApplicationController.assignApplication
);

router.get('/admin/applications/stats', 
  auth, 
  isAdmin, 
  loanApplicationController.getApplicationStats
);

module.exports = router;