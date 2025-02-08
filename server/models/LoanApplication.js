// server/models/LoanApplication.js
const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  // Basic Application Info
  loanAmount: {
    type: Number,
    required: true
  },
  loanType: {
    type: String,
    enum: ['PERSONAL', 'BUSINESS', 'HOME', 'EDUCATION', 'VEHICLE'],
    required: true
  },
  loanPurpose: {
    type: String,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  
  // Applicant Details
  age: {
    type: Number,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  employerName: {
    type: String,
    required: true
  },
  employmentType: {
    type: String,
    enum: ['SALARIED', 'SELF_EMPLOYED', 'BUSINESS', 'OTHER'],
    required: true
  },
  employmentLength: {
    type: Number,
    required: true
  },

  // Documents
  documents: [{
    type: {
      type: String,
      required: true,
      enum: ['PAN_CARD', 'AADHAR_CARD', 'INCOME_PROOF', 'BANK_STATEMENT']
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    rejectionReason: String
  }],

  // Assessment
  creditScore: {
    type: Number
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH']
  },
  eligibilityScore: {
    type: Number
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  existingEMIs: {
    type: Number,
    default: 0
  },

  // Application Status
  status: {
    type: String,
    enum: ['DRAFT', 'SUBMITTED', 'DOCUMENT_PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    default: 'DRAFT'
  },
  submittedAt: Date,
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },

  // Admin Review
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rejectionReason: String,
  approvedAmount: Number,
  approvedInterestRate: Number
}, {
  timestamps: true
});

// Update lastUpdatedAt before saving
loanApplicationSchema.pre('save', function(next) {
  this.lastUpdatedAt = new Date();
  next();
});

// Virtual for EMI calculation
loanApplicationSchema.virtual('emi').get(function() {
  const P = this.loanAmount;
  const R = (this.interestRate / 12) / 100;
  const N = this.tenure;
  
  return Math.round(
    P * R * Math.pow(1 + R, N) / 
    (Math.pow(1 + R, N) - 1)
  );
});

// Method to check if all required documents are uploaded
loanApplicationSchema.methods.areDocumentsComplete = function() {
  const requiredDocs = ['PAN_CARD', 'AADHAR_CARD', 'INCOME_PROOF', 'BANK_STATEMENT'];
  return requiredDocs.every(docType => 
    this.documents.some(doc => doc.type === docType && doc.status === 'VERIFIED')
  );
};

// Method to check if application is ready for review
loanApplicationSchema.methods.isReadyForReview = function() {
  return this.status === 'SUBMITTED' && this.areDocumentsComplete();
};

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = LoanApplication;