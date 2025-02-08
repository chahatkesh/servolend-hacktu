// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

exports.googleAuth = async (req, res) => {
  try {
    if (!req.googleUser) {
      return res.status(400).json({ error: 'Google user data not found' });
    }

    const { googleId, email, name, picture, email_verified } = req.googleUser;

    if (!email_verified) {
      return res.status(400).json({ error: 'Email not verified with Google' });
    }

    // Find or create user
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        profileStatus: 'pending'
      });
      console.log('New user created:', user._id);
    }

    // Create JWT token
    const jwtToken = createToken(user._id);
    setTokenCookie(res, jwtToken);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        profileStatus: user.profileStatus,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Logged out successfully' });
};

exports.checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        profileStatus: user.profileStatus,
      },
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};