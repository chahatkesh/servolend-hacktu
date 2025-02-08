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
    // Temporary upload location
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    // Temporary filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only pdf, jpg, jpeg, png
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size cannot exceed 10MB' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// All routes require authentication
router.use(passport.authenticate('jwt', { session: false }));

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.delete('/profile', userController.deleteProfile);

// Document routes
router.get('/documents/:documentType', userController.getDocument);
router.put('/documents', validateDocumentUpdate, userController.updateDocument);
router.post('/documents/upload',
  upload.single('file'),
  handleMulterError,
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