// server/middleware/validation.js
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.validateGoogleToken = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.googleUser = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      email_verified: payload.email_verified
    };

    next();
  } catch (error) {
    console.error('Google token validation error:', error);
    res.status(401).json({ error: 'Invalid credential' });
  }
};

exports.validateProfileUpdate = (req, res, next) => {
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

  const errors = {};

  // Name validation
  if (name && name.length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  // Phone validation
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
    errors.phone = 'Invalid phone number format';
  }

  // Address validation
  if (!address) {
    errors.address = 'Address is required';
  } else if (address.length < 5) {
    errors.address = 'Address is too short';
  }

  // Occupation validation
  if (!occupation) {
    errors.occupation = 'Occupation is required';
  } else if (occupation.length < 2) {
    errors.occupation = 'Occupation is too short';
  }

  // Employer validation
  if (!employerName) {
    errors.employerName = 'Employer name is required';
  } else if (employerName.length < 2) {
    errors.employerName = 'Employer name is too short';
  }

  // Monthly income validation
  if (!monthlyIncome) {
    errors.monthlyIncome = 'Monthly income is required';
  } else if (isNaN(monthlyIncome) || Number(monthlyIncome) < 0) {
    errors.monthlyIncome = 'Monthly income must be a valid positive number';
  }

  // Preferred language validation
  if (preferredLanguage && !['English', 'Hindi', 'Gujarati'].includes(preferredLanguage)) {
    errors.preferredLanguage = 'Invalid language selection';
  }

  // Communication preferences validation
  if (communicationPreferences) {
    if (!Array.isArray(communicationPreferences)) {
      errors.communicationPreferences = 'Communication preferences must be an array';
    } else {
      const validPreferences = ['email', 'sms', 'push'];
      const invalidPrefs = communicationPreferences.filter(pref => !validPreferences.includes(pref));
      if (invalidPrefs.length > 0) {
        errors.communicationPreferences = `Invalid preferences: ${invalidPrefs.join(', ')}`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

exports.validateDocumentUpdate = (req, res, next) => {
  const { documentName, status } = req.body;
  const errors = {};

  if (!documentName) {
    errors.documentName = 'Document name is required';
  }

  if (!status) {
    errors.status = 'Status is required';
  } else if (!['pending', 'verified', 'rejected', 'required'].includes(status)) {
    errors.status = 'Invalid status value';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

exports.validateKycStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const errors = {};

  if (!status) {
    errors.status = 'Status is required';
  } else if (!['pending', 'verified', 'rejected'].includes(status)) {
    errors.status = 'Invalid status value';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};