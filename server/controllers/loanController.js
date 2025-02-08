// server/controllers/loanController.js
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');
const fetch = require('node-fetch');

exports.submitApplication = async (req, res) => {
  try {
    const {
      amount,
      tenure,
      purpose,
      interestRate,
      age,
      income,
      ownership,
      employmentLength
    } = req.body;

    // Call ML model API for eligibility prediction
    const predictionResponse = await fetch('https://deploy-api-17es.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        age: parseInt(age),
        income: parseInt(income),
        ownership,
        employment_len: parseFloat(employmentLength),
        loan_intent: purpose.toUpperCase(),
        loan_amnt: parseInt(amount),
        loan_int_rate: parseFloat(interestRate),
        loan_percent_income: (amount / income) * 100,
        cred_hist_len: 5 // Default value for now
      })
    });

    if (!predictionResponse.ok) {
      throw new Error('Failed to get eligibility prediction');
    }

    const predictionData = await predictionResponse.json();
    const eligibilityScore = parseFloat(predictionData['prob of eligible']) * 100;
    const isEligible = eligibilityScore > 70;

    // Determine risk level based on eligibility score
    let riskLevel;
    if (eligibilityScore >= 80) riskLevel = 'LOW';
    else if (eligibilityScore >= 60) riskLevel = 'MEDIUM';
    else riskLevel = 'HIGH';

    // Create loan application
    const loanApplication = new LoanApplication({
      userId: req.user.userId,
      amount,
      tenure,
      purpose,
      interestRate,
      age,
      income,
      ownership,
      employmentLength,
      eligibilityScore,
      isEligible,
      riskLevel,
      status: isEligible ? 'DOCUMENTS_PENDING' : 'REJECTED'
    });

    await loanApplication.save();

    res.json({
      loanApplication,
      eligibilityScore,
      isEligible,
      riskLevel
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit loan application' });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { documentType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const loanApplication = await LoanApplication.findById(applicationId);
    if (!loanApplication) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    // Add document to application
    loanApplication.documents.push({
      type: documentType,
      path: req.file.path,
      status: 'PENDING'
    });

    // Update application status
    loanApplication.status = 'UNDER_REVIEW';
    await loanApplication.save();

    res.json(loanApplication);
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

exports.getApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const loanApplication = await LoanApplication.findById(applicationId);
    
    if (!loanApplication) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    res.json({
      status: loanApplication.status,
      documents: loanApplication.documents,
      eligibilityScore: loanApplication.eligibilityScore,
      isEligible: loanApplication.isEligible,
      reviewNotes: loanApplication.reviewNotes,
      rejectionReason: loanApplication.rejectionReason
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({ error: 'Failed to get application status' });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ error: 'Failed to get user applications' });
  }
};

// Admin controllers
exports.reviewApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, reviewNotes, rejectionReason } = req.body;

    const loanApplication = await LoanApplication.findById(applicationId);
    if (!loanApplication) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    loanApplication.status = status;
    loanApplication.reviewNotes = reviewNotes;
    loanApplication.rejectionReason = rejectionReason;
    loanApplication.reviewedBy = req.user.userId;

    await loanApplication.save();

    res.json(loanApplication);
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({ error: 'Failed to review application' });
  }
};

exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({ 
      status: { $in: ['DOCUMENTS_PENDING', 'UNDER_REVIEW'] } 
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get pending applications error:', error);
    res.status(500).json({ error: 'Failed to get pending applications' });
  }
};

exports.verifyDocument = async (req, res) => {
  try {
    const { applicationId, documentId } = req.params;
    const { status } = req.body;

    const loanApplication = await LoanApplication.findById(applicationId);
    if (!loanApplication) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    const document = loanApplication.documents.id(documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.status = status;
    await loanApplication.save();

    res.json(loanApplication);
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
};