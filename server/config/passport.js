const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
    console.log('Extracted token from cookies:', token ? 'Token found' : 'No token');
  }
  return token;
};

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(options, async (req, payload, done) => {
    try {
      console.log('Verifying JWT token...');
      const user = await User.findById(payload.userId);
      if (user) {
        console.log('User found:', user._id);
        return done(null, { userId: user._id });
      }
      console.log('No user found for token');
      return done(null, false);
    } catch (error) {
      console.error('JWT verification error:', error);
      return done(error, false);
    }
  })
);

module.exports = passport;