const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Existing fields
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  employerName: {
    type: String,
    trim: true,
  },
  monthlyIncome: {
    type: String,
    trim: true,
  },
  creditScore: {
    type: String,
    trim: true,
  },
  profileStatus: {
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending',
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  preferredLanguage: {
    type: String,
    enum: ['English', 'Hindi', 'Gujarati'],
    default: 'English',
  },
  communicationPreferences: [{
    type: String,
    enum: ['email', 'sms', 'push']
  }],
  documents: [{
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'required'],
      default: 'pending'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    filePath: String,
    originalName: String,
    mimeType: String,
    size: Number
  }],

  // New loan application fields
  loanApplication: {
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    income: {
      type: Number,
      min: 0
    },
    ownership: {
      type: String,
      enum: ['RENT', 'MORTGAGE', 'OWN', 'OTHER']
    },
    employment_len: {
      type: Number,
      min: 0
    },
    loan_intent: {
      type: String,
      enum: ['EDUCATION', 'PERSONAL', 'MEDICAL', 'VENTURE', 'DEBT_CONSOLIDATION', 'HOME_IMPROVEMENT']
    },
    loan_amnt: {
      type: Number,
      min: 0
    },
    loan_int_rate: {
      type: Number,
      min: 0,
      max: 100
    },
    loan_percent_income: {
      type: Number,
      min: 0
    },
    cred_hist_len: {
      type: Number,
      min: 0
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'rejected'],
      default: 'draft'
    },
    eligibilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  memberSince: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Existing timestamps update
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.isModified('loanApplication')) {
    this.loanApplication.lastUpdated = Date.now();
  }
  next();
});

// Existing virtual for formatted member since date
userSchema.virtual('memberSinceFormatted').get(function () {
  return this.memberSince.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
});

// Existing methods
userSchema.methods.isProfileComplete = function () {
  return Boolean(
    this.phone &&
    this.address &&
    this.occupation &&
    this.employerName &&
    this.monthlyIncome
  );
};

userSchema.methods.areDocumentsVerified = function () {
  return this.documents.every(doc => doc.status === 'verified');
};

const User = mongoose.model('User', userSchema);

module.exports = User;