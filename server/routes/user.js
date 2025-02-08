// server/routes/user.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const userController = require('../controllers/userController');
const {
  validateProfileUpdate,
  validateDocumentUpdate,
  validateKycStatusUpdate
} = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only pdf, jpg, jpeg, png
    if (file.mimetype === 'application/pdf' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  }
});

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.delete('/profile', userController.deleteProfile);

// Document routes
router.put('/documents', validateDocumentUpdate, userController.updateDocument);
router.post('/documents/upload',
  upload.single('file'),
  userController.uploadDocument
);

// KYC status route
router.put('/kyc-status',
  validateKycStatusUpdate,
  userController.updateKycStatus
);

// Communication preferences route
router.put('/preferences',
  userController.updateCommunicationPreferences
);

module.exports = router;