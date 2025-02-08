const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    }
  }],
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

// Update timestamp before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for formatted member since date
userSchema.virtual('memberSinceFormatted').get(function () {
  return this.memberSince.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
});

// Method to check if profile is complete
userSchema.methods.isProfileComplete = function () {
  return Boolean(
    this.phone &&
    this.address &&
    this.occupation &&
    this.employerName &&
    this.monthlyIncome
  );
};

// Method to check if all required documents are verified
userSchema.methods.areDocumentsVerified = function () {
  return this.documents.every(doc => doc.status === 'verified');
};

const User = mongoose.model('User', userSchema);

module.exports = User;