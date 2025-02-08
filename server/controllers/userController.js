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

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      occupation,
      employerName,
      monthlyIncome,
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