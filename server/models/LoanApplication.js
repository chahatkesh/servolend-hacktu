const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Basic Information
  amount: {
    type: Number,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  interestRate: {
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
  ownership: {
    type: String,
    enum: ['RENT', 'OWN', 'MORTGAGE', 'OTHER'],
    required: true
  },
  employmentLength: {
    type: Number,
    required: true
  },
  
  // Model Assessment
  eligibilityScore: {
    type: Number,
    required: true
  },
  isEligible: {
    type: Boolean,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    required: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['PENDING', 'DOCUMENTS_PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  documents: [{
    type: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin Review
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  rejectionReason: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
loanApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for EMI calculation
loanApplicationSchema.virtual('emi').get(function() {
  const principal = this.amount;
  const ratePerMonth = (this.interestRate / 12) / 100;
  const numberOfPayments = this.tenure;
  
  return Math.round(
    principal * 
    ratePerMonth * 
    Math.pow(1 + ratePerMonth, numberOfPayments) / 
    (Math.pow(1 + ratePerMonth, numberOfPayments) - 1)
  );
});

// Method to check document completion
loanApplicationSchema.methods.areDocumentsComplete = function() {
  return this.documents.every(doc => doc.status === 'VERIFIED');
};

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = LoanApplication;