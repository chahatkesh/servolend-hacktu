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
    const { documentName, status } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find existing document or create new one
    let docIndex = user.documents.findIndex(d => d.name === documentName);
    if (docIndex !== -1) {
      user.documents[docIndex].status = status;
    } else {
      user.documents.push({
        name: documentName,
        status,
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

    // Update or add document record
    let docIndex = user.documents.findIndex(d => d.name === documentType);
    if (docIndex !== -1) {
      user.documents[docIndex].status = 'pending';
      user.documents[docIndex].uploadDate = new Date();
    } else {
      user.documents.push({
        name: documentType,
        status: 'pending',
        uploadDate: new Date()
      });
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Document upload error:', error);
    // Clean up uploaded file if there was an error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
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

    // Delete any uploaded documents
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