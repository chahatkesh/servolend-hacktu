// server/controllers/loanApplicationController.js
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find({ userId: req.user.userId })
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Create new application
exports.createApplication = async (req, res) => {
  try {
    const {
      loanAmount,
      loanType,
      loanPurpose,
      tenure,
      income,
      occupation,
      employerName,
      employmentType,
      employmentLength,
      monthlyIncome,
      existingEMIs
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const application = new LoanApplication({
      userId: user._id,
      applicantName: user.name,
      loanAmount,
      loanType,
      loanPurpose,
      tenure,
      income,
      occupation,
      employerName,
      employmentType,
      employmentLength,
      monthlyIncome,
      existingEMIs,
      age: req.body.age,
      interestRate: 10.5, // Default interest rate
      status: 'DRAFT'
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user has permission to view this application
    if (req.user.role !== 'ADMIN' && application.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// Update application
exports.updateApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user has permission to update this application
    if (req.user.role !== 'ADMIN' && application.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Only allow updates if application is in DRAFT status
    if (application.status !== 'DRAFT' && req.user.role !== 'ADMIN') {
      return res.status(400).json({ error: 'Cannot update submitted application' });
    }

    // Update allowed fields
    const updatableFields = [
      'loanAmount', 'loanType', 'loanPurpose', 'tenure', 'income',
      'occupation', 'employerName', 'employmentType', 'employmentLength',
      'monthlyIncome', 'existingEMIs'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    await application.save();
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (application.status !== 'DRAFT') {
      return res.status(400).json({ error: 'Application already submitted' });
    }

    application.status = 'SUBMITTED';
    application.submittedAt = new Date();
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// Admin Functions

// Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const { status, search, sort = '-createdAt' } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    if (search) {
      query.$or = [
        { applicantName: new RegExp(search, 'i') },
        { _id: new RegExp(search, 'i') }
      ];
    }

    const applications = await LoanApplication.find(query)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name')
      .sort(sort);

    res.json(applications);
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, note, rejectionReason } = req.body;
    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.status = status;
    if (rejectionReason) {
      application.rejectionReason = rejectionReason;
    }

    if (note) {
      application.reviewNotes.push({
        note,
        addedBy: req.user.userId
      });
    }

    await application.save();
    res.json(application);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

// Assign application to loan officer (admin only)
exports.assignApplication = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.assignedTo = assignedTo;
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Assign application error:', error);
    res.status(500).json({ error: 'Failed to assign application' });
  }
};

// Get application statistics (admin only)
exports.getApplicationStats = async (req, res) => {
  try {
    const stats = await LoanApplication.aggregate([
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          pendingApplications: {
            $sum: {
              $cond: [{ $in: ['$status', ['SUBMITTED', 'UNDER_REVIEW']] }, 1, 0]
            }
          },
          approvedApplications: {
            $sum: { $cond: [{ $eq: ['$status', 'APPROVED'] }, 1, 0] }
          },
          rejectedApplications: {
            $sum: { $cond: [{ $eq: ['$status', 'REJECTED'] }, 1, 0] }
          },
          totalLoanAmount: { $sum: '$loanAmount' }
        }
      }
    ]);

    res.json(stats[0] || {
      totalApplications: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      totalLoanAmount: 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch application statistics' });
  }
};