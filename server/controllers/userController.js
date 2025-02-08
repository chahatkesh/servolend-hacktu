// server/controllers/userController.js
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-__v -googleId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLoanApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.loanApplication || {});
  } catch (error) {
    console.error('Get loan application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateLoanApplication = async (req, res) => {
  try {
    const {
      age,
      income,
      ownership,
      employment_len,
      loan_intent,
      loan_amnt,
      loan_int_rate,
      loan_percent_income,
      cred_hist_len,
      eligibilityScore,
      status
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize loanApplication if it doesn't exist
    if (!user.loanApplication) {
      user.loanApplication = {};
    }

    // Update loan application fields
    Object.assign(user.loanApplication, {
      age: age || user.loanApplication.age,
      income: income || user.loanApplication.income,
      ownership: ownership || user.loanApplication.ownership,
      employment_len: employment_len || user.loanApplication.employment_len,
      loan_intent: loan_intent || user.loanApplication.loan_intent,
      loan_amnt: loan_amnt || user.loanApplication.loan_amnt,
      loan_int_rate: loan_int_rate || user.loanApplication.loan_int_rate,
      loan_percent_income: loan_percent_income || user.loanApplication.loan_percent_income,
      cred_hist_len: cred_hist_len || user.loanApplication.cred_hist_len,
      status: status || user.loanApplication.status,
      eligibilityScore: eligibilityScore || user.loanApplication.eligibilityScore,
      lastUpdated: Date.now()
    });

    await user.save();
    res.json(user.loanApplication);
  } catch (error) {
    console.error('Update loan application error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      occupation,
      employerName,
      monthlyIncome,
      creditScore,
      preferredLanguage,
      communicationPreferences
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    Object.assign(user, {
      name: name || user.name,
      phone,
      address,
      occupation,
      employerName,
      monthlyIncome,
      creditScore,
      preferredLanguage,
      communicationPreferences
    });

    // Update profile status based on completion
    user.profileStatus = user.isProfileComplete() ? 'complete' : 'pending';

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { documentName, status, rejectionReason } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find existing document or create new one
    let docIndex = user.documents.findIndex(d => d.name === documentName);
    if (docIndex !== -1) {
      user.documents[docIndex].status = status;
      if (rejectionReason) {
        user.documents[docIndex].rejectionReason = rejectionReason;
      }
    } else {
      user.documents.push({
        name: documentName,
        status,
        rejectionReason,
        uploadDate: new Date()
      });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const documentType = req.body.documentType;
    if (!documentType) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/documents';
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExt = path.extname(req.file.originalname);
    const uniqueFilename = `${documentType}-${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Move file to permanent location
    await fs.rename(req.file.path, filePath);

    // Update or add document record
    let docIndex = user.documents.findIndex(d => d.name === documentType);
    const docData = {
      name: documentType,
      status: 'PENDING',
      uploadDate: new Date(),
      filePath: filePath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    };

    if (docIndex !== -1) {
      // Delete old file if it exists
      if (user.documents[docIndex].filePath) {
        await fs.unlink(user.documents[docIndex].filePath).catch(console.error);
      }
      user.documents[docIndex] = docData;
    } else {
      user.documents.push(docData);
    }

    await user.save();
    res.json({
      message: 'Document uploaded successfully',
      document: docData
    });
  } catch (error) {
    console.error('Document upload error:', error);
    // Clean up uploaded file if there was an error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const { documentType } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const document = user.documents.find(d => d.name === documentType);
    if (!document || !document.filePath) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Stream the file
    res.sendFile(document.filePath, { root: '.' });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateKycStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.kycStatus = status;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update KYC status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCommunicationPreferences = async (req, res) => {
  try {
    const { preferredLanguage, communicationPreferences } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (preferredLanguage) {
      user.preferredLanguage = preferredLanguage;
    }

    if (communicationPreferences) {
      user.communicationPreferences = communicationPreferences;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update communication preferences error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete all uploaded documents
    for (const doc of user.documents) {
      if (doc.filePath) {
        await fs.unlink(doc.filePath).catch(console.error);
      }
    }

    await user.deleteOne();
    res.clearCookie('token');
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-__v -googleId')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all loan applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await User.find({
      'loanApplication.status': { $exists: true }
    }).select('name email picture documents loanApplication kycStatus createdAt');

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a specific document
exports.viewDocument = async (req, res) => {
  try {
    const { documentName } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const document = user.documents.find(doc => doc.name === documentName);
    if (!document || !document.filePath) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Stream the file
    res.sendFile(document.filePath, { root: '.' });
  } catch (error) {
    console.error('View document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const { documentName } = req.params;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const document = user.documents.find(doc => doc.name === documentName);
    if (!document || !document.filePath) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.download(document.filePath, document.originalName);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update document status
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { documentName, status, rejectionReason } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the document
    const docIndex = user.documents.findIndex(doc => doc.name === documentName);
    if (docIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Update document status
    user.documents[docIndex].status = status;
    if (status === 'REJECTED' && rejectionReason) {
      user.documents[docIndex].rejectionReason = rejectionReason;
    }

    // Save the changes
    await user.save();

    res.json(user.documents[docIndex]);
  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};